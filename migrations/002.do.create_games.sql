CREATE TABLE games (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    msrp numeric,
    min_players integer,
    max_players integer,
    min_playtime integer,
    max_playtime integer,
    min_age integer,
    description TEXT,
    rules TEXT,
    small_image TEXT,
    medium_image TEXT,
    original_image TEXT,
    data_entered TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO games (id, name, msrp, min_players, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image)
VALUES
    (
        'AuBvbISHR6',
        'Ticket To Ride',
        49.99,
        2,
        5,
        45,
        90,
        8,
        'Ticket to Ride is a cross-country train adventure game. Players collect train cards that enable them to claim railway routes connecting cities throughout North America. The longer the routes, the more points they earn. Additional points come to those who can fulfill their Destination Tickets by connecting two distant cities, and to the player who builds the longest continuous railway. So climb aboard for some railroading fun and adventure. You''ve got a Ticket to Ride! \r\n \r\nOctober 2, 1900 -- it''s 28 years to the day that noted London eccentric, Phileas Fogg accepted and then won a 20,000 bet that he could travel Around the World in 80 Days. Now at the dawn of the century some old friends have gathered to celebrate Fogg''s impetuous and lucrative gamble -- and to propose a new wager of their own. The stakes: $1 million in a winner-takes-all competition. The objective: to see the most cities in North America -- in just 7 days.  \r\n \r\n-Spiel Des Jahres 2004(German game of the year) \r\n-As d''Or Cannes 2004 (French game of the year) \r\n-Game of the year 2004 - Japan \r\n-Game of the year 2004 - Sweden \r\n-Game of the year 2004 - Finland \r\n-Diana Jones Excellence in Gaming Award 2004 \r\n-Origins Award Winner - Best Board Game 2005 \r\n-Game of the year 2004 - Spain \r\n-Parent''s Choice Foundation Silver Medal 2004',
        'https://ncdn0.daysofwonder.com/tickettoride/en/img/tt_rules_2015_en.pdf',
        'https://d2k4q26owzy373.cloudfront.net/150x150/games/uploaded/1559254202421-61wLscAHHSL.jpg',
        'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254202421-61wLscAHHSL.jpg',
        'https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1559254202421-61wLscAHHSL.jpg'
    ),
    (
        '7UFLK3V2Tg',
        'Hues and Cues',
        25,
        3,
        10,
        15,
        45,
        8,
        ' Hues and Cues is a vibrant game of colorful communication where players are challenged to make connections to colors with words. Using only one and two-word cues, players try to get others to guess a specific hue from the 480 colors on the game board. The closer the guesses are to the target, the more points you earn. Since everyone imagines colors differently, connecting colors and clues has never been this much fun! \r\n  Contains:  \r\n \r\n 1 Game Board \r\n 100 Color Cards \r\n 30 Player Pieces \r\n 1 Rulebook \r\n 1 Scoring Frame \r\n ',
        null,
        'https://d2k4q26owzy373.cloudfront.net/150x150/games/uploaded/1588604425297',
        'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1588604425297',
        'https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1588604425297'
    ),
    (
        'uOhZRZa3xN',
        'Boggle',
        9.99,
        1,
        8,
        10,
        10,
        8,
        ' Earn points by spotting words your friends don''t before time runs out. Shake the grid to mix up the letter cubes. Then lift the lid and flip the timer. Players have 90 seconds to write down as many words as they can find on the grid before time is up. \r\n At the end of the round, score the words. If two or more players find the same word, that word doesn''t count. The player with the highest score wins. ',
        null,
        'https://d2k4q26owzy373.cloudfront.net/150x150/games/uploaded/1596747678447',
        'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1596747678447',
        'https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1596747678447'
    );