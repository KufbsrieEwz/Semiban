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

floor_type = [ # 1st floor
    'B',
    'b', # pressed
    'D',
    'd', # open
    'T', # target
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
    # object, wall, floor (entirety), floor type (button, door, target, floor), floor class (win, number, master, all), floor extra attribute (direction, inversion, none)
    return tile_code[0], tile_code[1], tile_code[2:4], tile_code[2], tile_code[3], tile_code[4]

class SemibanLogic:
    def __init__(self):
        # declaration
        self.board = []
        self.level = 1
        self.moves = 0
        self.targets = 0
        self.fulfilled = 0
        self.won = False

    def parse_level(self, level):
        board = []
        for row in level:
            parsed_row = []
            for cell in row.split(' '):
                if cell:
                    parsed_row.append(cell)
            board.append(parsed_row)
        self.board = board

    def check_win(self):
        fulfilled = 0
        total = 0
        win = False # has win
        fwin = False # fulfilled win
        for y in self.board:
            for x in self.board[y]:
                cell = self.board[y][x]
                cObject, _, _, cType, cClass, _ = get_all(cell)
                if cType == 'T':
                    if cClass == 'W':
                        win = True
                        if cObject == 'P':
                            fwin = True
                    else:
                        total += 1
                        if not cObject == '.':
                            fulfilled += 1

        self.targets, self.fulfilled = total, fulfilled
        if not fulfilled == total:
            return False
        if win and fwin:
            return True
        elif not win:
            return True
        else:
            return False

    def check_button(self):
        total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                   0] # master
        pressed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                   0] # master
        pressed_classes = []
        for y in self.board:
            for x in self.board[y]:
                cell = self.board[y][x]
                cObject, _, _, cType, cClass, _ = get_all(cell)
                if cType == 'B':
                    if cClass == 'M':
                        total[10] += 1
                    else:
                        total[cClass] += 1
                    if not cObject == '.':
                        if cClass == 'M':
                            pressed[10] += 1
                        else:
                            pressed[cClass] += 1
        for bClass in range(len(total)):
            if pressed[bClass] >= total[bClass]:
                if bClass == 10:
                    pressed_classes.append('M')
                else:
                    pressed_classes.append(cClass)
        
        
        for y in self.board:
            for x in self.board[y]:
                cell = self.board[y][x]
                cObject, cWall, _, cType, cClass, cExtra = get_all(cell)
                cell_start = cObject + cWall
                floor_end = cClass + cExtra
                if cType == 'D': # closed
                    if 'M' in pressed_classes: # master button opens
                        self.board[y][x] = cell_start + 'd' + floor_end
                    elif cClass in pressed_classes:
                        self.board[y][x] = cell_start + 'd' + floor_end
                elif cType == 'd': # open
                    if 'M' in pressed_classes: # do not close if master button is open
                        pass
                    elif cClass not in pressed_classes:
                        if cObject == '.': # if not obstructed, because if it is then it should stay open
                            self.board[y][x] = cell_start + 'D' + floor_end
        
    def move_player(self, dir):
        if not self.won:
            dx, dy = {
                'up': (0, -1),
                'down': (0, 1),
                'left': (-1, 0),
                'right': (1, 0)
            }[dir]
            # x, y = player position
            # move_x, move_y = x + dx, y + dy
            """
            move_cell = self.board[move_y][move_x]
            player_cell = self.board[y][x]
            semiwall = False
            spike = False
            _, pWall, pFloor, _, _, _ = get_all(player_cell)
            mObject, mWall, _, mType, mClass, mExtra = get_all(move_cell)
            if mWall == '#':
                return
            elif mType == 'D':
                return
            elif mWall == 'S':
                semiwall = True
            elif mWall == '^':
                spike = True # set for later, to kill the player ykyk

            if mObject == 'C':
                self.crate()
            elif mObject == 'M':
                self.multipush()
            elif mObject == 'I':
                self.ice()
            elif mObject == 'P':
                print('Why is there a player?')

            if semiwall: # player cannot move to a semiwall, but player should be able to push objects on there
                return
            else:
                self.board[y][x] = '.' + pWall + pFloor
            if not spike:
                # move the player to the new position
                self.board[move_y][move_x] = 'P.' + pFloor
            """
            self.moves += 1
            self.check_button()
            #self.save_state()
            self.won = self.check_win()

        pass

    def crate(self, move_x, move_y, dx, dy):
        push_x, push_y = move_x + dx, move_y + dy
        push_target = self.board[push_y][push_x]
        # too lazy to convert rest
        """
        if desired location's wall value is a wall:
            return

        if desired location's box value is a crate/multipush/ice:
            return

        # otherwise it is allowed to move:
        move the crate onto the location
        """
        pass

    def multipush(self, new_x, new_y, dx, dy):
        # this is a recursive function
        push_x, push_y = move_x + dx, move_y + dy
        push_target = self.board[push_y][push_x]
        # too lazy to convert rest
        """
        if desired location's wall value is a wall:
            return

        if desired location's box value is a crate/multipush/ice:
            call the respective function

        # otherwise it is allowed to move:
        move the multipush onto the location, make sure that it also keeps whatever the floor is (by ONLY changing the box value)

        # ye i think thats it cuz its just a slightly changed version of normal crate
        """
        pass

    def ice(self, move_x, move_y, dx, dy):
        push_x, push_y = move_x + dx, move_y + dy
        push_target = self.board[push_y][push_x]
        # too lazy to convert rest
        """
        if desired location's wall value is a wall:
            return

        if desired location's box value is a crate/multipush/ice:
            return

        # otherwise it is allowed to move:
        move the ice onto the location, make sure that it also keeps whatever the floor is (by ONLY changing the box value)

        if player's movement location is semiwall:
            pass # because you should not be able to move
        else:
            move the player to the new position, ONLY edit the box value to the player and remove the old player part

        curr_x, curr_y = new_x, new_y
        while True:
            curr_x += dx
            curr_y += dy
            current location is whatever the curr x and curr y is
            if current location's wall value is a wall:
                ice_x = curr_x - dx
                ice_y = curr_y - dy
            elif current location's box value is a crate/multipush/ice:
                ice_x = curr_x - dx
                ice_y = curr_y - dy
            else:
                continue

            ice location is whatever the ice x and ice y is
            set the ice location's box value to ice
            break
        """
        pass