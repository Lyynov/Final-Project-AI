package service

import (
	"encoding/csv"
	"errors"
	"strings"

	repository "a21hc3NpZ25tZW50/repository/fileRepository"
)

type FileService struct {
	Repo *repository.FileRepository
}

func (s *FileService) ProcessFile(fileContent string) (map[string][]string, error) {
	// Parse CSV content
	reader := csv.NewReader(strings.NewReader(fileContent))
	records, err := reader.ReadAll()
	if err != nil {
		return nil, errors.New("failed to read CSV content: " + err.Error())
	}

	// Check if there are rows in the CSV
	if len(records) < 2 {
		return nil, errors.New("no data found in CSV")
	}

	// Create a map to store the processed data
	result := make(map[string][]string)

	// The first row is the header
	headers := records[0]

	// Iterate over the remaining rows to populate the map
	for _, row := range records[1:] {
		for i, value := range row {
			// Ensure the column index exists in the header
			if i < len(headers) {
				header := headers[i]
				result[header] = append(result[header], value)
			}
		}
	}

	return result, nil
}
