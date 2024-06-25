import { createColumnHelper } from '@tanstack/react-table';

// Create a column helper instance
const columnHelper = createColumnHelper();

const TABLE = {
  // Function to create columns based on the provided names
  CREATE_COLUMN: col => {
    return col.map(({ key, name, isDate }) =>
      columnHelper.accessor(key, {
        cell: info => info.getValue(),
        header: name,
        meta: {
          isDate: isDate || false,
        },
      }),
    );
  },
};

export default TABLE;
