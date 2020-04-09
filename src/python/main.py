first_name_pattern = r'^[\w\-\'\,]+(?:\s[\w\-\'\.]+)?\,\s+(?:\w\.?\s)?(?<firstName>[\w\-\']{2,})'
date_pattern = r'^(?<year>[1-2][890]\d{2})(?<month>(?:0[1-9])|(?:1[0-2]))'
extraction_pattern = r'(?<date>\d{18})\|(?:\w+)?\|(?:\w+)?\|(?<name>[A-Z\,\'\.\s]+)?'

def print_results(results: dict):
  print(f'Total number of lines: {results['line_count']}')

def main(filename: str):
  results = { 'line_count': 0 }
  with open(filename, 'r') as file:
    for line in file:
      results['line_count'] += 1



if __name__ == "__main__":
  import sys

  main(sys.argv[1])