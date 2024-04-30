import pandas as pd
import sys

def main2(line1):
    file_path = './h.csv'
    data = pd.read_csv(file_path)
    # inpt=sys.argv[0]
    # species = sys.argv[0].lower()
    # sys.stdout.write("gottttt")
    # soil_temp = float(sys.argv[1])
    # Ph = float(sys.argv[2])
    # soil_moisture = sys.argv[3]
    # N = float(sys.argv[4])
    # P = float(sys.argv[5])
    # K = float(sys.argv[6])
    # if len(sys.argv) != 2:
    #     sys.stderr.write("Usage: python script.py <input_string>\n")
    #     sys.exit(1)

    # Extract the input string
    # line = sys.stdin.readline()
    sys.stdout.write("heeeeeeeeeeee")
    print("haha")
    sys.stdout.flush()

    # Split the input string by spaces to get individual values
    # values = line1.split()

    # # Check if all 6 values are present
    # # if len(values) != 6:
    # #     sys.stderr.write("Error: Insufficient values provided\n")
    # #     sys.exit(1)

    # # Assign the separated values to variables
    # s=""
    # species, soil_temp, pH, N, P, K, moisture =values
    # Ph=float(pH)
    # N=float(N)
    # P=float(P)
    # K=float(K)
    # soil_temp=float(soil_temp)
    # soil_moisture=float(moisture)
    # flag=False
    # # sys.stdout.write("gottttt")
    # print("hhahahhaha")
    # for i in range(len(data)):
    #     if data['Species name'][i] == species:
    #         flag=True
    #         break
    # if flag==False:
    #     sys.stdout.write("Species not found...")
    #     # exit()
    # if soil_temp < data['Soil Temperature1'][i]:
    #     sys.stdout.write('Soil Temperature needs to be more for proper growth')
    # elif soil_temp > data['Soil Temperature2'][i]:
    #     sys.stdout.write('Soil Temperature needs to be less for proper growth')
    # else:
    #     sys.stdout.write('soil temperature is what it needs to be')
    # if Ph < data['PH of Soil1'][i]:
    #     sys.stdout.write('soil needs to be more basic for proper growth')
    # elif Ph > data['PH of Soil2'][i]:
    #     sys.stdout.write('soil needs to be more acidic for proper growth')
    # else:
    #     sys.stdout.write('soil Ph value is maintained')
    # if soil_moisture < data['moisture1'][i]:
    #     sys.stdout.write('I need water')
    # elif soil_moisture > data['moisture2'][i]:
    #     sys.stdout.write('I am overwatered')
    # else:
    #     sys.stdout.write('Thanks for providing me enough water')
    # count = 0
    # if N < data['N1'][i]:
    #     sys.stdout.write('I need fertilizers rich in nitrogen')
    #     count = 1
    # elif N > data['N2'][i]:
    #     sys.stdout.write('Nitrogen content is too much')
    #     count = 1
    # if P < data['P1'][i]:
    #     sys.stdout.write('I need fertilizers rich in Phosphorus')
    #     count = 1
    # elif P > data['P2'][i]:
    #     sys.stdout.write('Phosphorus content is too much')
    #     count = 1
    # if K < data['K1'][i]:
    #     sys.stdout.write('I need fertilizers rich in Potassium')
    #     count = 1
    # elif K > data['K2'][i]:
    #     sys.stdout.write('Potassium content is too much')
    #     count = 1
    # if count == 0:
    #     sys.stdout.write('I am rich in nutrients. Thanks')
    # sys.stdout.flush()