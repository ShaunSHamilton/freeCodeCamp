

CREATE TABLE IF NOT EXISTS certifications(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  object_id VARCHAR(24) NOT NULL,
  dashed_name TEXT NOT NULL,
  state ENUM('current','upcoming','legacy') NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS certifications_prerequisites(
  certification_id INT NOT NULL,
  prerequisite_object_id VARCHAR(24) NOT NULL,
  PRIMARY KEY (certification_id, prerequisite_object_id),
  FOREIGN KEY (certification_id) REFERENCES certifications(id)
);


CREATE TABLE IF NOT EXISTS superblocks(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  dashed_name TEXT NOT NULL,
  superblock_order INT NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS blocks(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  dashed_name TEXT NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS superblocks_blocks(
  superblock_id INT NOT NULL,
  block_id INT NOT NULL,
  block_order int NOT NULL,
  PRIMARY KEY (superblock_id, block_id),
  FOREIGN KEY (superblock_id) REFERENCES superblocks(id),
  FOREIGN KEY (block_id) REFERENCES blocks(id)
);


CREATE TABLE IF NOT EXISTS challenges (
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  object_id VARCHAR(24) NOT NULL,
  dashed_name TEXT NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS blocks_challenges(
  block_id INT NOT NULL,
  challenge_id INT NOT NULL,
  challenge_order int NOT NULL,
  PRIMARY KEY (block_id, challenge_id),
  FOREIGN KEY (block_id) REFERENCES blocks(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS block_time_to_complete(
  id INT NOT NULL AUTO_INCREMENT,
  block_id INT NOT NULL,
  time_to_complete TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (block_id) REFERENCES blocks(id)
)


  CREATE TABLE IF NOT EXISTS block_is_upcoming(
    id INT NOT NULL AUTO_INCREMENT,
    block_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (block_id) REFERENCES blocks(id)
  )


CREATE TABLE IF NOT EXISTS app_url(
  id INT AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  required BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS source_code_url(
  id INT AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  required BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS local_address_allowed(
  id INT AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS editor_address_allowed(
  id INT AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS display_preview_modal(
  id INT AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


  CREATE TABLE IF NOT EXISTS uses_multifile_editor(
    id INT AUTO_INCREMENT,
    challenge_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
  );


CREATE TABLE IF NOT EXISTS assignments (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  assignments JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS challenge_files (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  challengeFiles JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS forum_topic_id (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  forumTopicId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS help_category (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  helpCategory TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS instructions (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  instructions TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS solutions (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  solutions JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS tests (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  tests JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS title (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  title TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS video_url (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  videoUrl TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS descriptions (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  descriptions TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS required_resources (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  required_resources JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS challenge_type (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  challengeType INT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS template (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  template TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS bilibili_ids (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  bilibiliIds JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS question (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  question JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS video_id (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  videoId TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS notes (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  notes TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS course_url (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  course_url TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS disable_loop_protect_preview (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS disable_loop_protect_tests (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS ms_trophy_id (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  msTrophyId TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS prerequisites (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  prerequisites JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS scene (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  scene JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS fill_in_the_blank (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  fillInTheBlank JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS audio_path (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  audioPath TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);


CREATE TABLE IF NOT EXISTS video_locale_ids (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  videoLocaleIds JSON,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);
