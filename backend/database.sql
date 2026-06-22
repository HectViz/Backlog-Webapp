DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS platforms;
DROP TABLE IF EXISTS genres;

-- PLATAFORMAS
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    manufacturer VARCHAR(100) NOT NULL,
    description TEXT
);

-- GÉNEROS
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- JUEGOS
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    platform_id INT REFERENCES platforms(id) ON DELETE SET NULL,
    genre_id INT REFERENCES genres(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'En cola' CHECK (status IN ('En cola', 'Jugando', 'Completado')),
    priority INT DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    cover_path VARCHAR(255),
    review TEXT
);

-- INSERTAR PLATAFORMAS DE PRUEBA
INSERT INTO platforms (name, manufacturer, description) VALUES
('PC', 'Others', 'Computadora o laptop orientada a gaming de alto rendimiento.'),
('Nintendo Switch', 'Nintendo', 'Consola híbrida ideal para couch o handheld gaming.'),
('PlayStation 5', 'Sony', 'Consola de última generación.'),
('Xbox Series X', 'Microsoft', 'Consola de última generación.');

-- INSERTAR GÉNEROS DE PRUEBA
INSERT INTO genres (name, description) VALUES
('Acción', 'Juegos con énfasis en desafíos físicos, coordinación y tiempo de reacción.'),
('Aventura', 'Juegos enfocados en la exploración, resolución de acertijos y narrativa.'),
('RPG (Rol)', 'Juegos de rol con progresión de personajes, estadísticas y toma de decisiones.'),
('Plataformas', 'Juegos donde el jugador debe saltar y correr entre plataformas suspendidas.'),
('Estrategia', 'Juegos enfocados en la toma de decisiones tácticas y planificación a gran escala.'),
('Metroidvania', 'Juegos de plataformas y aventura con progresión no lineal y áreas bloqueadas.');

-- INSERTAR JUEGOS DE PRUEBA. LAS IMAGENES SE SUBEN DESDE EL FRONTEND  
INSERT INTO games (title, platform_id, genre_id, status, priority, cover_path, review) VALUES
('Hollow Knight Silksong', 1, 6, 'Completado', 5, NULL, 'Metroidvania indie, buen combate, una mejora significativa desde la primera entrega.'),
('Super Mario Odyssey', 2, 4, 'Jugando', 5, NULL, 'Buenas mecánicas pulidas para un juego de Mario. Jugando en emulador.'),
('Marvel''s Spider-Man 2', 3, 1, 'En cola', 4, NULL, 'Pendiente por jugar después de la primera entrega.'),
('Portal 2', 1, 2, 'Completado', 5, NULL, 'Uno de los mejores juegos de hace unos años. Buenos puzzles, mejor historia.'),
('Astro Bot', 3, 4, 'En cola', 3, NULL, 'Plataformer que ganó el goty hace unos años. Buena primera impresión pero lo dejo para luego.');
