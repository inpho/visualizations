#!/usr/bin/env python

import csv

if __name__ == "__main__":
    with  open("num_areas.csv", 'r') as fin:
        reader = csv.reader(fin, delimiter=",")
        ran = [line[2] for line in reader]
        ran.pop(0)
        ran = [int(n) for n in ran]
        print max(ran)
        print min(ran)
