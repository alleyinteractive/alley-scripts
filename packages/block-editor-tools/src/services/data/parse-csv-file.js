import Papa from 'papaparse';

/**
 * Given a File object containing CSV data, parses the CSV and returns an array
 * of objects that are keyed by column names. Assumes that the first row in the
 * CSV is the name of the column. Skips empty lines and attempts to do automatic
 * type conversion.
 * @param {File} file - The CSV file object.
 * @returns {Promise} - A Promise that will resolve to an array of row objects.
 */
const parseCSVFile = (file) => new Promise((resolve, reject) => {
  Papa.parse(
    file,
    {
      complete: (results) => resolve(results.data),
      dynamicTyping: true,
      error: (error) => reject(error),
      header: true,
      skipEmptyLines: true,
    },
  );
});

export default parseCSVFile;
