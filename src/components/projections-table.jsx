import PropTypes from 'prop-types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { ListItem, UnorderedList, Box } from '@chakra-ui/react';
import { NOTES } from '../helper/compute';

export default function ProjectionsTable({
  projections,
  handleInputTurbulence,
  showAllCol,
}) {
  return (
    <>
      <Center>
        <Text fontSize="3xl">Bi-weekly Projections</Text>
      </Center>
      <Table variant="striped" colorScheme="green">
        <Thead>
          <Tr whiteSpace={'preserve'}>
            <Th>Date</Th>
            <Th>Functional</Th>
            <Th>Non-Functional</Th>
            <Th>Travelers</Th>
            {showAllCol && (
              <>
                <Th>Not Yet Started</Th>
                <Th>Total FTE</Th>
                <Th>Resigned</Th>
                <Th>Away</Th>
                <Th>Orientation</Th>
              </>
            )}
            <Th>Turbulence</Th>
            <Th>Predicted Functional</Th>
            <Th>Predicted Functional + Travelers</Th>
            <Th>Predicted Functional + Travelers Gap</Th>
            <Th>Predicted Functional Gap (Needed)</Th>
            <Th>Predicted Functional Gap (Target)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {projections.map((row, index) => {
            let showInput = false;

            // Parse the current row's start date
            const currentStartDate = new Date(row.end);

            // Show the input box only for the first pay period in each month
            if (
              index === 0 ||
              (index > 0 &&
                new Date(projections[index - 1].end).getMonth() !==
                  currentStartDate.getMonth())
            ) {
              showInput = true;
            }

            return (
              <Tr key={index}>
                <Td>
                  {row.start} - {row.end}
                </Td>
                <Td> {row.functional} </Td>
                <Td> {row.non_functional} </Td>
                {/* TRAVELERS */}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.travelers}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <UnorderedList spacing={2}>
                          {NOTES[`${row.start} - ${row.end}`].travelers.map(
                            (item, index) => (
                              <ListItem key={index}>
                                <Text fontWeight="bold">
                                  {item['First Name']} {item['Last Name']} -{' '}
                                  {item.FTE} FTE
                                </Text>
                              </ListItem>
                            ),
                          )}
                        </UnorderedList>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                {showAllCol && (
                  <>
                    {/* NOT YET STARTED */}
                    <Td>
                      <Popover placement="top-start">
                        <PopoverTrigger>
                          <button>{row.not_yet_started}</button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader fontWeight="semibold">
                            {NOTES[`${row.start} - ${row.end}`].payPeriod}
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            <UnorderedList spacing={2}>
                              {NOTES[
                                `${row.start} - ${row.end}`
                              ].not_yet_started.map((item, index) => (
                                <ListItem key={index}>
                                  <Text fontWeight="bold">
                                    {item['First Name']} {item['Last Name']} -{' '}
                                    {item.FTE} FTE
                                  </Text>
                                  <Box>
                                    <Text>Start: {item['Start']}</Text>
                                  </Box>
                                </ListItem>
                              ))}
                            </UnorderedList>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td> {row.total_fte} </Td>
                    {/* RESIGNED */}
                    <Td>
                      <Popover placement="top-start">
                        <PopoverTrigger>
                          <button>{row.resigned}</button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader fontWeight="semibold">
                            {NOTES[`${row.start} - ${row.end}`].payPeriod}
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            <UnorderedList spacing={2}>
                              {NOTES[`${row.start} - ${row.end}`].resigned.map(
                                (item, index) => (
                                  <ListItem key={index}>
                                    <Text fontWeight="bold">
                                      {item['First Name']} {item['Last Name']} -{' '}
                                      {item.FTE} FTE
                                    </Text>
                                    <Box>
                                      <Text>
                                        Resigned: {item['Resignation']}
                                      </Text>
                                    </Box>
                                  </ListItem>
                                ),
                              )}
                            </UnorderedList>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    {/* AWAY */}
                    <Td>
                      <Popover placement="top-start">
                        <PopoverTrigger>
                          <button>{row.away}</button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader fontWeight="semibold">
                            {NOTES[`${row.start} - ${row.end}`].payPeriod}
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            <UnorderedList spacing={2}>
                              {NOTES[`${row.start} - ${row.end}`].away.map(
                                (item, index) => (
                                  <ListItem key={index}>
                                    <Text fontWeight="bold">
                                      {item['First Name']} {item['Last Name']} -{' '}
                                      {item.FTE} FTE
                                    </Text>
                                    <Box>
                                      <Text>
                                        Away Start: {item['Away Start']}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Text>
                                        Away Return: {item['Away Return']}
                                      </Text>
                                    </Box>
                                  </ListItem>
                                ),
                              )}
                            </UnorderedList>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    {/* ORIENTATION */}
                    <Td>
                      <Popover placement="top-start">
                        <PopoverTrigger>
                          <button>{row.orientation}</button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader fontWeight="semibold">
                            {NOTES[`${row.start} - ${row.end}`].payPeriod}
                          </PopoverHeader>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            <UnorderedList spacing={2}>
                              {NOTES[
                                `${row.start} - ${row.end}`
                              ].orientation.map((item, index) => (
                                <ListItem key={index}>
                                  <Text fontWeight="bold">
                                    {item['First Name']} {item['Last Name']} -{' '}
                                    {item.FTE} FTE
                                  </Text>
                                  <Box>
                                    <Text>
                                      Orientation Start: {item['Start']}
                                    </Text>
                                  </Box>
                                  <Box>
                                    <Text>
                                      Orientation End: {item['Orientation End']}
                                    </Text>
                                  </Box>
                                </ListItem>
                              ))}
                            </UnorderedList>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                  </>
                )}

                {/* TURBULENCE */}
                {showInput ? (
                  <Td key={`${row.start} - ${row.end}`}>
                    <NumberInput>
                      <NumberInputField
                        placeholder={`${currentStartDate.toLocaleString(
                          'en-US',
                          {
                            month: 'long',
                          },
                        )} Turbulence`}
                        value={row.turbulence || ''}
                        onChange={event => {
                          handleInputTurbulence(
                            `${row.start} - ${row.end}`,
                            event,
                          );
                        }}
                      />
                    </NumberInput>
                  </Td>
                ) : (
                  <Td> </Td>
                )}
                {/* PREDICTED FUNCTIONAL */}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.predicted_functional}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              NOTES[`${row.start} - ${row.end}`]
                                .predicted_functional,
                          }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                {/* PREDICTED FUNCTIONAL TRAVELERS */}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.predicted_functional_travelers}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              NOTES[`${row.start} - ${row.end}`]
                                .predicted_functional_travelers,
                          }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                {/* PREDICTED FUNCTIONAL TRAVELERS GAP */}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.predicted_functional_travelers_gap}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              NOTES[`${row.start} - ${row.end}`]
                                .predicted_functional_travelers_gap,
                          }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                {/* PREDICTED FUNCTIONAL GAP NEEDED*/}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.predicted_functional_gap_needed}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              NOTES[`${row.start} - ${row.end}`]
                                .predicted_functional_gap_needed,
                          }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                {/* PREDICTED FUNCTIONAL GAP TARGET*/}
                <Td>
                  <Popover placement="top-start">
                    <PopoverTrigger>
                      <button>{row.predicted_functional_gap_target}</button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        {NOTES[`${row.start} - ${row.end}`].payPeriod}
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              NOTES[`${row.start} - ${row.end}`]
                                .predicted_functional_gap_target,
                          }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}

ProjectionsTable.propTypes = {
  projections: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleInputTurbulence: PropTypes.func.isRequired,
  showAllCol: PropTypes.bool.isRequired,
};
