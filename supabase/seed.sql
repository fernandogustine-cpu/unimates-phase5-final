insert into courses (title, level, description)
values
('Beginner Tactical Vision', 'Beginner', 'Forks, pins, skewers, checks, captures and threats.'),
('Piece Improvement Masterclass', 'Intermediate', 'Improve bad pieces, outposts, open files and activity.'),
('Tournament Preparation', 'Advanced', 'Calculation, opening files, endgame conversion and psychology.');

insert into puzzles (title, fen, question, answer, theme, difficulty)
values
('Back Rank Mate', '8/6pp/8/8/8/8/6PP/4R1K1 w - - 0 1', 'White to move. Find the winning move.', 'Re8+', 'Back Rank', 1),
('Knight Fork', '6k1/8/8/1N6/8/8/8/6K1 w - - 0 1', 'Find a knight fork idea.', 'Nc7', 'Fork', 1);

insert into tournaments (name, venue, start_date)
values ('Uni-Mates Internal Training Event', 'Randfontein', current_date);
