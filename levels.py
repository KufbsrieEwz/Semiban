chapter_info = [
    {
        'id': 0,
        'name': 'Custom Level',
        'description': 'Imported level.',
        'start_level': -1,
        'color': '#ffffff'
    },
    {
        'id': 1,
        'name': 'Tutorial',
        'description': 'Learn the basics of Semiban and how to play the game.',
        'start_level': 0,
        'color': '#4CAF50'
    }
]

chapter_one = [
    # Tutorial
    [ # basic level
        ".#... .#... .#... .#... .#... .#...",
        ".#... P.... ..... ..... ..... .#...",
        ".#... ..... ..... ..... ..... .#...",
        ".#... ..... ..... ..... ..WT. .#...",
        ".#... .#... .#... .#... .#... .#..."
    ],
]
chapter_two = [
    # Slippery Trials
]
chapter_three = [
    # Industrial Revolution
]
chapter_four = [
    # Momentum Transfer
]
chapter_five = [
    # Name TBD
]
chapter_six = [
    # Name TBD
]
challenges = [
    # Challenge Levels
]
extra = [
    # Extra Levels
]

metadata = {
    0: { # Level 1
        'name': 'First Steps',
        'caption': 'Welcome to Semiban! Use arrow keys to move.',
        'min_moves': 5,
        'par': 5,
        'difficulty': 'Beginner'
    },
}

levels = [
    *chapter_one,
    *chapter_two,
    *chapter_three,
    *chapter_four,
    *chapter_five,
    *chapter_six,
    *challenges,
    *extra
]