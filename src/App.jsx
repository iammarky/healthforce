import Papa from 'papaparse';
import { useState, useEffect } from 'react';
import {
  Input,
  SimpleGrid,
  Divider,
  HStack,
  Text,
  Center,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { COMPUTE } from './helper/compute';
import ImportedDataTable from './components/imported-data-table';
import ProjectionsTable from './components/projections-table';
import generateDateRanges from './helper/date-range';
import TABLE from './helper/data-table';

const App = () => {
  const [parsedData, setParsedData] = useState({
    data: [],
    error: '',
  });
  const [projections, setProjections] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState('');
  const [needed, setNeeded] = useState(0);
  const [target, setTarget] = useState(0);

  const readFile = event => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: results => {
          setParsedData({
            data: results.data,
            error: '',
          });
        },
        error: error => {
          setParsedData({
            data: [],
            error: error.message,
          });
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  const handleInputChange = event => {
    setRange(event.target.value);
  };

  useEffect(() => {
    const calculatedProjection = [];
    if (selectedDate && range) {
      const autoCalculate = async () => {
        const ranges = generateDateRanges(selectedDate, range);
        // for (const range of ranges) {
        //   calculatedProjection.push({
        //     start: range.start,
        //     end: range.end,
        //     functional: await COMPUTE.FUNCTIONAL(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     non_functional: await COMPUTE.NON_FUNCTIONAL(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     travelers: await COMPUTE.TRAVELERS(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     not_yet_started: await COMPUTE.NOT_YET_STARTED(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     total_fte: await COMPUTE.TOTAL_FTE(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     resigned: await COMPUTE.RESIGNED(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     away: await COMPUTE.AWAY(range.start, range.end, parsedData.data),
        //     orientation: await COMPUTE.ORIENTATION(
        //       range.start,
        //       range.end,
        //       parsedData.data,
        //     ),
        //     turbulence: 0,
        //     predicted_functional: 0,
        //     predicted_functional_travelers: 0,
        //     predicted_functional_travelers_gap: 0,
        //     predicted_functional_gap_needed: 0,
        //     predicted_functional_gap_target: 0,
        //   });
        // }
        ranges.forEach(async (range, index) => {
          calculatedProjection.push({
            start: range.start,
            end: range.end,
            functional: await COMPUTE.FUNCTIONAL(
              range.start,
              range.end,
              parsedData.data,
            ),
            non_functional: await COMPUTE.NON_FUNCTIONAL(
              range.start,
              range.end,
              parsedData.data,
            ),
            travelers: await COMPUTE.TRAVELERS(
              range.start,
              range.end,
              parsedData.data,
            ),
            not_yet_started: await COMPUTE.NOT_YET_STARTED(
              range.start,
              range.end,
              parsedData.data,
            ),
            total_fte: await COMPUTE.TOTAL_FTE(
              range.start,
              range.end,
              parsedData.data,
            ),
            resigned: await COMPUTE.RESIGNED(
              range.start,
              range.end,
              parsedData.data,
            ),
            away: await COMPUTE.AWAY(range.start, range.end, parsedData.data),
            orientation: await COMPUTE.ORIENTATION(
              range.start,
              range.end,
              parsedData.data,
            ),
            turbulence: 0,
            predicted_functional: 0,
            predicted_functional_travelers: 0,
            predicted_functional_travelers_gap: 0,
            predicted_functional_gap_needed: 0,
            predicted_functional_gap_target: 0,
            index: index,
          });
        });
      };
      autoCalculate();
      setProjections(calculatedProjection);
    }
  }, [range, selectedDate, parsedData]);

  const handleInputTurbulence = async (index, event) => {
    const newProjections = [...projections];

    if (event.target.value) {
      projections[index].turbulence = parseFloat(event.target.value);
    } else {
      projections[index].turbulence = 0;
    }

    await COMPUTE.PREDICTED_FUNCTIONAL(index, event.target.value, projections);

    setProjections(newProjections);
  };

  return (
    <>
      {parsedData.error && (
        <Center bg="tomato" h="50px" color="white">
          Unable to parse csv file
        </Center>
      )}
      <SimpleGrid columns={[1]} spacing="20px">
        <SimpleGrid
          columns={[3]}
          spacing="10px"
          paddingY={5}
          paddingX={10}
          bg="lightcyan">
          <HStack>
            <Text>Upload imported data </Text>
            <input
              id="upload"
              type="file"
              accept=".csv,.xlsx"
              onChange={readFile}
              onClick={event => {
                event.target.value = null;
              }}
            />
          </HStack>
          <HStack>
            <span>Select a date</span>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </HStack>
          <HStack>
            <span>Number of Weeks</span>
            <Input
              variant="outline"
              placeholder="Range"
              value={range}
              onChange={handleInputChange}
            />
          </HStack>
          <HStack>
            <span>Needed</span>
            <NumberInput>
              <NumberInputField
                variant="outline"
                placeholder="Needed Value"
                value={needed}
                onChange={e => setNeeded(e.target.value)}
              />
            </NumberInput>
          </HStack>
          <HStack>
            <span>Target</span>
            <NumberInput>
              <NumberInputField
                variant="outline"
                placeholder="Target Value"
                value={target}
                onChange={e => setTarget(e.target.value)}
              />
            </NumberInput>
          </HStack>
        </SimpleGrid>
        <ProjectionsTable
          projections={projections}
          handleInputTurbulence={handleInputTurbulence}
        />
        <Divider />
        <ImportedDataTable
          data={parsedData.data}
          columns={TABLE.CREATE_COLUMN([
            { key: 'Code', name: 'Code' },
            { key: 'Last Name', name: 'Last Name' },
            { key: 'First Name', name: 'First Name' },
            { key: 'FTE', name: 'FTE' },
            { key: 'Start', name: 'Orientation Start', isDate: true },
            { key: 'Orientation End', name: 'Orientation End', isDate: true },
            { key: 'Resignation', name: 'Resignation', isDate: true },
            { key: 'Away Start', name: 'Away Start', isDate: true },
            { key: 'Away Return', name: 'Away Return', isDate: true },
            { key: 'FTE Change', name: 'FTE Change' },
            {
              key: 'Date of FTE Change',
              name: 'Date of FTE Change',
              isDate: true,
            },
            { key: 'Float FTE', name: 'Float FTE' },
            {
              key: 'Date of Float FTE Start',
              name: 'Date of Float FTE Start',
              isDate: true,
            },
          ])}
        />
      </SimpleGrid>
    </>
  );
};

export default App;
