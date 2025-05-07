use futures_util::StreamExt;
use mongodb::bson::doc;
use sentry::types::Dsn;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod db;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(sentry::integrations::tracing::layer())
        .with(EnvFilter::from_default_env())
        .init();
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

    let _ = update_moderation_collection().await;
}

#[tracing::instrument]
async fn update_moderation_collection() {
    let mongo_uri = dotenvy_macro::dotenv!("MONGOHQ_URL");
    let client = db::client(mongo_uri).await.unwrap();
    let moderation_collection = db::get_collection(&client, "ExamModeration").await.unwrap();
    let attempt_collection = db::get_collection(&client, "EnvExamAttempt").await.unwrap();
    let exam_collection = db::get_collection(&client, "EnvExam").await.unwrap();

    // For all expired attempts, create a moderation entry
    // 1. Get all exams
    // 2. Find all attempts where `(attempt.startTimeInMS + exam.config.totalTimeInMS) < now`
    let mut exams = exam_collection.find(doc! {}).await.unwrap();
    while let Some(exam) = exams.next().await {
        let exam = exam.unwrap();
        let exam_id = exam.get_object_id("_id").unwrap();
        let total_time_in_ms = exam
            .get_document("config")
            .unwrap()
            .get_i64("totalTimeInMS")
            .unwrap();

        // Get all attempts for this exam
        let mut attempts = attempt_collection
            .find(doc! {"examId": exam_id})
            .await
            .unwrap();

        while let Some(attempt) = attempts.next().await {
            let attempt = attempt.unwrap();
            let start_time_in_ms = attempt.get_i64("startTimeInMS").unwrap();
            if start_time_in_ms + total_time_in_ms < chrono::Utc::now().timestamp_millis() {
                // Create a moderation entry
                moderation_collection
                    .insert_one(doc! {"examAttemptId": attempt.get_object_id("_id").unwrap()})
                    .await
                    .unwrap();
            }
        }
    }
}

pub fn valid_sentry_dsn(url: &str) -> bool {
    url.parse::<Dsn>().is_ok()
}

// Tests are needed for schema changes
#[cfg(test)]
mod tests {
    use crate::update_moderation_collection;

    #[tokio::test]
    async fn moderation_record_is_created() {
        let _ = update_moderation_collection().await;
    }
}
