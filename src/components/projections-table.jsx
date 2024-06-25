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
} from '@chakra-ui/react';

export default function ProjectionsTable({ projections }) {
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
            <Th>Not Yet Started</Th>
            <Th>Total FTE</Th>
            <Th>Resigned</Th>
            <Th>Away</Th>
            <Th>Orientation</Th>
            {/* <Th>Predicted Functional</Th>
                <Th>Predicted Functional + Travelers</Th>
                <Th>Predicted Functional + Travelers Gap</Th>
                <Th>Predicted Functional Gap (Needed)</Th>
                <Th>Predicted Functional Gap (Target)</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {projections.map((row, index) => {
            return (
              <Tr key={index}>
                <Td>
                  {row.start} - {row.end}{' '}
                </Td>
                <Td> {row.functional} </Td>
                <Td> {row.non_functional} </Td>
                <Td> {row.travelers} </Td>
                <Td> {row.not_yet_started} </Td>
                <Td> {row.total_fte} </Td>
                <Td> {row.resigned} </Td>
                <Td> {row.away} </Td>
                <Td> {row.orientation} </Td>
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
};
