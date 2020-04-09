import time
import re
from collections import Counter

first_name_pattern = re.compile(r'^[\w\-\'\,]+(?:\s[\w\-\'\.]+)?\,\s+(?:\w\.?\s)?(?P<firstName>[\w\-\']{2,})')
date_pattern = re.compile(r'^(?P<year>[1-2][890]\d{2})(?P<month>(?:0[1-9])|(?:1[0-2]))')
extraction_pattern = re.compile(r'(?P<date>\d{18})\|(?:\w+)?\|(?:\w+)?\|(?P<name>[A-Z\,\'\.\s]+)?')

line_count = 0
notable_names = []
first_name_counter = Counter()
date_counter = Counter()

def log(message: str):
  print(f'[{time.strftime("%X")}] {message}')

def print_results():
  end_time = time.perf_counter()
  global start_time
  global line_count
  log('Execution took {0:.2f} seconds.'.format(end_time - start_time))
  log(f'Total number of lines: { line_count }')

def count_ocurrence_subs(input: str, pattern: re.Pattern, counter: Counter):
  try:
    if match := pattern.search(input):
      counter[''.join(match.groups())] += 1
  except Exception as ex:
    print(ex)

def main(filename: str):
  global line_count
  global notable_names
  global first_name_counter
  global date_counter

  log(f'Started execution...')

  with open(filename, 'r') as file:
    for line in file:
      line_count += 1
      date, name = extraction_pattern.search(line).groups()

      name = name or ''
      if line_count == 432 or line_count == 43243:
        notable_names.append(name)

      count_ocurrence_subs(name, first_name_pattern, first_name_counter)
  print_results()

start_time = time.perf_counter()
if __name__ == "__main__":
  import sys

  main(sys.argv[1])