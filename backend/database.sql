DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS platforms;

-- PLATAFORMAS
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    manufacturer VARCHAR(100) NOT NULL,
    description TEXT
);

-- JUEGOS
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    platform_id INT REFERENCES platforms(id) ON DELETE SET NULL,
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

-- INSERTAR JUEGOS DE PRUEBA. LAS IMAGENES SE SUBEN DESDE EL FRONTEND  
INSERT INTO games (title, platform_id, status, priority, cover_path, review) VALUES
('Hollow Knight Silksong', 1, 'Completado', 5, NULL, 'Metroidvania indie, buen combate, una mejora significativa desde la primera entrega.'),
('Super Mario Odyssey', 2, 'Jugando', 5, NULL, 'Buenas mecánicas pulidas para un juego de Mario. Jugando en emulador.'),
('Marvel''s Spider-Man 2', 3, 'En cola', 4, NULL, 'Pendiente por jugar después de la primera entrega.'),
('Portal 2', 1, 'Completado', 5, NULL, 'Uno de los mejores juegos de hace unos años. Buenos puzzles, mejor historia.'),
('Astro Bot', 3, 'En cola', 3, NULL, 'Plataformer que ganó el goty hace unos años. Buena primera impresión pero lo dejo para luego.');
