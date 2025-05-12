use chrono::TimeZone;
use futures_util::{StreamExt, TryStreamExt};
use mongodb::bson::{DateTime, doc, oid::ObjectId};
use prisma::{EnvExam, EnvExamAttempt, ExamModeration};
use sentry::types::Dsn;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod db;
mod prisma;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(sentry::integrations::tracing::layer())
        .with(EnvFilter::from_default_env())
        // Log to stdout
        // .with(tracing_subscriber::fmt::layer().pretty())
        .init();
    tracing::info!("Starting exam moderation service...");
    let sentry_dsn = dotenvy_macro::dotenv!("SENTRY_DSN");
    let _guard = if valid_sentry_dsn(sentry_dsn) {
        tracing::info!("initializing Sentry");
        // NOTE: Events are only emitted, once the guard goes out of scope.
        Some(sentry::init((
            sentry_dsn,
            sentry::ClientOptions {
                release: sentry::release_name!(),
                traces_sample_rate: 1.0,
                ..Default::default()
            },
        )))
    } else {
        tracing::warn!("Sentry DSN is invalid. skipping initialization");
        None
    };

    if let Err(e) = update_moderation_collection().await {
        tracing::error!("Error updating moderation collection: {:?}", e);
    } else {
        tracing::info!("Successfully updated moderation collection");
    }
}

#[tracing::instrument]
async fn update_moderation_collection() -> anyhow::Result<()> {
    let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
    let client = db::client(mongo_uri).await?;

    let moderation_collection =
        db::get_collection::<ExamModeration>(&client, "ExamModeration").await;
    let attempt_collection = db::get_collection::<EnvExamAttempt>(&client, "EnvExamAttempt").await;
    let exam_collection = db::get_collection::<EnvExam>(&client, "EnvExam").await;

    let moderation_records: Vec<ExamModeration> = moderation_collection
        .find(doc! {})
        .await?
        .try_collect()
        .await?;
    let exam_attempt_ids: Vec<ObjectId> = moderation_records
        .iter()
        .map(|r| r.exam_attempt_id)
        .collect();
    // For all expired attempts, create a moderation entry
    // 1. Get all exams
    // 2. Find all attempts where `(attempt.startTimeInMS + exam.config.totalTimeInMS) < now`
    let mut exams = exam_collection.find(doc! {}).await?;
    while let Some(exam) = exams.next().await {
        let exam = exam?;
        let total_time_in_ms = exam.config.total_time_in_ms;
        tracing::debug!("Checking exam: {}", exam.id);

        // Get all attempts for this exam where the attempt id is not in the moderation collection
        let mut attempts = attempt_collection
            .find(doc! {
              "examId": exam.id,
              "_id": {
                  "$nin": &exam_attempt_ids
              }
            })
            .await?;

        while let Some(attempt) = attempts.next().await {
            let attempt = attempt?;
            let start_time_in_ms = attempt.start_time_in_ms;
            let expiry_time_in_ms = start_time_in_ms + total_time_in_ms;
            let now = chrono::Utc::now().timestamp_millis();
            let expired = expiry_time_in_ms < now;

            tracing::debug!(
                "Attempt {} expires at: {:?}",
                attempt.id,
                chrono::Utc.timestamp_millis_opt(expiry_time_in_ms)
            );
            if expired {
                tracing::info!("Creating moderation entry for attempt: {}", attempt.id);
                let exam_moderation = ExamModeration {
                    id: ObjectId::new(),
                    exam_attempt_id: attempt.id,
                    approved: false,
                    feedback: None,
                    moderation_date: None,
                    submission_date: DateTime::from_millis(now),
                };

                // Create a moderation entry
                moderation_collection.insert_one(exam_moderation).await?;
            }
        }
    }
    Ok(())
}

pub fn valid_sentry_dsn(url: &str) -> bool {
    url.parse::<Dsn>().is_ok()
}

// Tests are needed for schema changes
#[cfg(test)]
mod tests {
    use mongodb::{
        Client,
        bson::Document,
        change_stream::{ChangeStream, event::ChangeStreamEvent},
    };

    use crate::*;

    /// Add exam data, add attempt data, call function, check if moderation record is created
    /// Call again, ensure no more records are created
    /// Add new attempt
    /// Call again, ensure new record is created
    #[tokio::test]
    async fn moderation_record_is_created() {
        let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
        let client = db::client(mongo_uri).await.unwrap();
        let moderation_collection =
            db::get_collection::<ExamModeration>(&client, "ExamModeration").await;
        let attempt_collection =
            db::get_collection::<EnvExamAttempt>(&client, "EnvExamAttempt").await;
        let exam_collection = db::get_collection::<EnvExam>(&client, "EnvExam").await;

        let exam_1 = EnvExam {
            id: ObjectId::new(),
            config: prisma::EnvExamConfig {
                total_time_in_ms: 1000,
            },
        };
        let exam_2 = EnvExam {
            id: ObjectId::new(),
            config: prisma::EnvExamConfig {
                total_time_in_ms: 2000,
            },
        };
        let a = exam_collection
            .insert_many([&exam_1, &exam_2])
            .await
            .unwrap();

        let attempt_1 = EnvExamAttempt {
            id: ObjectId::new(),
            start_time_in_ms: 0,
            exam_id: exam_1.id,
        };
        let attempt_2 = EnvExamAttempt {
            id: ObjectId::new(),
            start_time_in_ms: 0,
            exam_id: exam_2.id,
        };
        attempt_collection
            .insert_many([&attempt_1, &attempt_2])
            .await
            .unwrap();

        let test_start_date = mongodb::bson::DateTime::now();

        let _ = update_moderation_collection().await.unwrap();

        let moderation_records: Vec<ExamModeration> = moderation_collection
            .find(doc! {})
            .await
            .unwrap()
            .try_collect()
            .await
            .unwrap();

        let record_1 = moderation_records
            .iter()
            .find(|r| r.exam_attempt_id == attempt_1.id)
            .unwrap();
        let record_2 = moderation_records
            .iter()
            .find(|r| r.exam_attempt_id == attempt_2.id)
            .unwrap();

        assert!(moderation_records.len() >= 2);
        assert_eq!(record_1.exam_attempt_id, attempt_1.id);
        assert_eq!(record_2.exam_attempt_id, attempt_2.id);
        assert_eq!(record_1.approved, false);
        assert_eq!(record_2.approved, false);
        assert_eq!(record_1.feedback, None);
        assert_eq!(record_2.feedback, None);
        assert_eq!(record_1.moderation_date, None);
        assert_eq!(record_2.moderation_date, None);
        // Submission date should be greater than `test_start_date`
        assert!(record_1.submission_date.timestamp_millis() > test_start_date.timestamp_millis());
        assert!(record_2.submission_date.timestamp_millis() > test_start_date.timestamp_millis());

        let _ = update_moderation_collection().await.unwrap();
        let moderation_records_without_change: Vec<ExamModeration> = moderation_collection
            .find(doc! {})
            .await
            .unwrap()
            .try_collect()
            .await
            .unwrap();

        assert_eq!(
            moderation_records.len(),
            moderation_records_without_change.len()
        );

        let attempt_3 = EnvExamAttempt {
            id: ObjectId::new(),
            start_time_in_ms: 0,
            exam_id: exam_1.id,
        };
        attempt_collection.insert_one(&attempt_3).await.unwrap();

        let test_start_date = mongodb::bson::DateTime::now();

        let _ = update_moderation_collection().await.unwrap();
        let moderation_record: ExamModeration = moderation_collection
            .find_one(doc! {
                "examAttemptId": attempt_3.id
            })
            .await
            .unwrap()
            .unwrap();

        assert_eq!(moderation_record.exam_attempt_id, attempt_3.id);
        assert_eq!(moderation_record.approved, false);
        assert_eq!(moderation_record.feedback, None);
        assert_eq!(moderation_record.moderation_date, None);
        // Submission date should be greater than `test_start_date`
        assert!(
            moderation_record.submission_date.timestamp_millis()
                > test_start_date.timestamp_millis()
        );
    }

    /// Check if all records in the `EnvExam` collection are deserializable
    #[tokio::test]
    async fn exam_schema_is_unchanged() {
        let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
        let client = db::client(mongo_uri).await.unwrap();
        let exam_collection = db::get_collection::<EnvExam>(&client, "EnvExam").await;
        let _exams: Vec<EnvExam> = exam_collection
            .find(doc! {})
            .await
            .unwrap()
            .try_collect()
            .await
            .unwrap();
    }

    /// Check if all records in the `EnvExamAttempt` collection are deserializable
    #[tokio::test]
    async fn attempt_schema_is_unchanged() {
        let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
        let client = db::client(mongo_uri).await.unwrap();
        let attempt_collection =
            db::get_collection::<EnvExamAttempt>(&client, "EnvExamAttempt").await;
        let _attempts: Vec<EnvExamAttempt> = attempt_collection
            .find(doc! {})
            .await
            .unwrap()
            .try_collect()
            .await
            .unwrap();
    }

    /// Check if all records in the `ExamModeration` collection are deserializable
    #[tokio::test]
    async fn moderation_schema_is_unchanged() {
        let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
        let client = db::client(mongo_uri).await.unwrap();
        let moderation_collection =
            db::get_collection::<ExamModeration>(&client, "ExamModeration").await;
        let _moderations: Vec<ExamModeration> = moderation_collection
            .find(doc! {})
            .await
            .unwrap()
            .try_collect()
            .await
            .unwrap();
    }
}
