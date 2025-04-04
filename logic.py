objects = [ # 1st char
    'P',
    'C',
    'M',
    'I',
    '.'
]

walls = [ # 2nd char
    '#',
    'S',
    '^',
    '.'
]

floor_root = [ # 1st floor
    'B',
    'b', # pressed
    'D',
    'd', # open
    'T',
    '-', # null tile
    '.'
]

floor_class = [ # 2nd floor
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    'M',
    'A',
    'W', # win target
    '.'
]

floor_extra = [ # 3rd floor
    # directions
    'U',
    'D',
    'L',
    'R',
    # inverse
    'I',
    # none
    '.'
]

def get_all(tile_code):
    # To only take the code for the first three, use _ to ignore the other tile codes.
    return tile_code[0], tile_code[1], tile_code[5], tile_code[2:4], tile_code[5]

class SemibanLogic:
    def __init__(self):
        # declaration
        self.board = []
        self.level = 1
        self.fulfilled = 0
        self.targets = 0
        self.all_targets_fulfilled = False
        self.has_win_tile = False
        self.player_on_win = False

    def get_all(tile_code):
        return tile_code[0], tile_code[1], tile_code[2:5]

    def check_win(self):
        fulfilled = 0
        total = 0
        for cell in self.board:
            pass
        self.fulfilled, self.targets = fulfilled, total