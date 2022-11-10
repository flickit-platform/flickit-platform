
STATUS_CHOICES = [
    ('WEAK', 'WEAK'),
    ('RISKY', 'RISKY'),
    ('NORMAL', 'NORMAL'),
    ('GOOD', 'GOOD'),
    ('OPTIMIZED', 'OPTIMIZED')
]

def normlize_Value(value):
    match value:
        case 1:
            return 0
        case 2:
            return 0
        case 3:
            return 0.5
        case 4:
            return 0.9
        case 5:
            return 1

class Dictionary(dict):
 
  # __init__ function
  def __init__(self):
    self = dict()
 
  # Function to add key:value
  def add(self, key, value):
    self[key] = value