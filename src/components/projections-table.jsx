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

export default function ProjectionsTable({
  projections,
  handleInputTurbulence,
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
            {/* <Th>Not Yet Started</Th>
            <Th>Total FTE</Th>
            <Th>Resigned</Th>
            <Th>Away</Th>
            <Th>Orientation</Th> */}
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
            const currentStartDate = new Date(row.start);

            // Show the input box only for the first pay period in each month
            if (
              index === 0 ||
              (index > 0 &&
                new Date(projections[index - 1].start).getMonth() !==
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
                <Td> {row.travelers} </Td>
                {/* <Td> {row.not_yet_started} </Td>
                <Td> {row.total_fte} </Td>
                <Td> {row.resigned} </Td>
                <Td> {row.away} </Td>
                <Td> {row.orientation} </Td> */}
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
                <Td> {row.predicted_functional} </Td>
                <Td> {row.predicted_functional_travelers} </Td>
                <Td> {row.predicted_functional_travelers_gap} </Td>
                <Td> {row.predicted_functional_gap_needed} </Td>
                <Td> {row.predicted_functional_gap_target} </Td>
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
};
