import os
from itertools import chain

if __name__ == "__main__":
    result = (chain.from_iterable(glob(os.path.join(x[0], '*.txt')) for x in os.walk('.')))
    print(result)