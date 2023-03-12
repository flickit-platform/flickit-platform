

class ActionResult():
    def __init__(self, message = None, success = None, data = None, **kwargs):
        self.message = message
        self.success = success
        self.data = data
        self.kwargs = kwargs


class Dictionary(dict):
 
  # __init__ function
  def __init__(self):
    self = dict()
 
  # Function to add key:value
  def add(self, key, value):
    self[key] = value

  def get(self, key):
    return self[key]
    

