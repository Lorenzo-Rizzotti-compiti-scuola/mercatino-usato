CREATE TABLE users
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(250) UNIQUE NOT NULL,
    password_hash VARCHAR(255)        NOT NULL,
    first_name    VARCHAR(100)        NOT NULL,
    last_name     VARCHAR(100),
    age           INT,
    class         VARCHAR(50)
);

CREATE TABLE categories
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE CHECK (char_length(name) > 0)
);

INSERT INTO categories (name)
VALUES ('Electronics'),
       ('Furniture'),
       ('Clothing'),
       ('Books');

CREATE TABLE advertisements
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT                       NOT NULL,
    title       VARCHAR(60)               NOT NULL,
    category_id INT                       NOT NULL,
    description TEXT                      NOT NULL,
    image_url   VARCHAR(255)              NOT NULL,
    status      ENUM ('active', 'closed') NOT NULL DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

CREATE TABLE proposals
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    ad_id     INT                                      NOT NULL,
    user_id   INT                                      NOT NULL,
    price     DECIMAL(10, 2)                           NOT NULL,
    date_time DATETIME                                 NOT NULL,
    status    ENUM ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (ad_id) REFERENCES advertisements (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
