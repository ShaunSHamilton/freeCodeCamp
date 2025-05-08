//! These structs are partial representations of the collections in the database.
//! Only the used fields are included.

use mongodb::bson::{DateTime, oid::ObjectId};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ExamModeration {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub approved: bool,
    #[serde(rename = "examAttemptId")]
    pub exam_attempt_id: ObjectId,
    pub feedback: Option<String>,
    #[serde(rename = "moderationDate")]
    pub moderation_date: Option<DateTime>,
    #[serde(rename = "submissionDate")]
    pub submission_date: DateTime,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EnvExamAttempt {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    #[serde(rename = "startTimeInMS")]
    pub start_time_in_ms: i64,
    #[serde(rename = "examId")]
    pub exam_id: ObjectId,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EnvExam {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub config: EnvExamConfig,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EnvExamConfig {
    #[serde(rename = "totalTimeInMS")]
    pub total_time_in_ms: i64,
}
