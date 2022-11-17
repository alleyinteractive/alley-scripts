export default parseCSVFile;
/**
 * Given a File object containing CSV data, parses the CSV and returns an array
 * of objects that are keyed by column names. Assumes that the first row in the
 * CSV is the name of the column. Skips empty lines and attempts to do automatic
 * type conversion.
 * @param {File} file - The CSV file object.
 * @returns {Promise} - A Promise that will resolve to an array of row objects.
 */
declare function parseCSVFile(file: File): Promise<any>;
