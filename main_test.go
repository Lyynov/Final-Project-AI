package main_test

import (
	"a21hc3NpZ25tZW50/service"
	"bytes"
	"io/ioutil"
	"net/http"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("FileService", func() {
	var fileService *service.FileService

	BeforeEach(func() {
		fileService = &service.FileService{}
	})

	Describe("ProcessFile", func() {
		It("should return the correct result for valid CSV data", func() {
			fileContent := `header1,header2
value1,value2
value3,value4`
			expected := map[string][]string{
				"header1": {"value1", "value3"},
				"header2": {"value2", "value4"},
			}

			result, err := fileService.ProcessFile(fileContent)
			Expect(err).ToNot(HaveOccurred())
			Expect(result).To(Equal(expected))
		})

		It("should return an error for empty CSV data", func() {
			fileContent := ``

			result, err := fileService.ProcessFile(fileContent)
			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})

		It("should return an error for invalid CSV data", func() {
			fileContent := `header1,header2
value1,value2
value3`

			result, err := fileService.ProcessFile(fileContent)
			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})
	})
})

type MockClient struct {
	DoFunc func(req *http.Request) (*http.Response, error)
}

func (m *MockClient) Do(req *http.Request) (*http.Response, error) {
	return m.DoFunc(req)
}

var _ = Describe("AIService", func() {
	var (
		mockClient *MockClient
		aiService  *service.AIService
	)

	BeforeEach(func() {
		mockClient = &MockClient{}
		aiService = &service.AIService{Client: mockClient}
	})

	Describe("AnalyzeData", func() {
		It("should return the correct result for a valid response", func() {
			mockClient.DoFunc = func(req *http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       ioutil.NopCloser(bytes.NewBufferString(`{"cells":["result"]}`)),
				}, nil
			}

			table := map[string][]string{
				"header1": {"value1", "value2"},
			}
			query := "query"
			token := "token"

			result, err := aiService.AnalyzeData(table, query, token)
			Expect(err).ToNot(HaveOccurred())
			Expect(result).To(Equal("result"))
		})

		It("should return an error for an empty table", func() {
			table := map[string][]string{}
			query := "query"
			token := "token"

			result, err := aiService.AnalyzeData(table, query, token)
			Expect(err).To(HaveOccurred())
			Expect(result).To(BeEmpty())
		})

		It("should return an error for an error response", func() {
			mockClient.DoFunc = func(req *http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusInternalServerError,
					Body:       ioutil.NopCloser(bytes.NewBufferString(`{"error":"internal error"}`)),
				}, nil
			}

			table := map[string][]string{
				"header1": {"value1", "value2"},
			}
			query := "query"
			token := "token"

			result, err := aiService.AnalyzeData(table, query, token)
			Expect(err).To(HaveOccurred())
			Expect(result).To(BeEmpty())
		})
	})

	Describe("ChatWithAI", func() {
		It("should return the correct response for a valid request", func() {
			mockClient.DoFunc = func(req *http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       ioutil.NopCloser(bytes.NewBufferString(`[{"generated_text":"response"}]`)),
				}, nil
			}

			context := "context"
			query := "query"
			token := "token"

			result, err := aiService.ChatWithAI(context, query, token)
			Expect(err).ToNot(HaveOccurred())
			Expect(result.GeneratedText).To(Equal("response"))
		})

		It("should return an error for an error response", func() {
			mockClient.DoFunc = func(req *http.Request) (*http.Response, error) {
				return &http.Response{
					StatusCode: http.StatusInternalServerError,
					Body:       ioutil.NopCloser(bytes.NewBufferString(`{"error":"internal error"}`)),
				}, nil
			}

			context := "context"
			query := "query"
			token := "token"

			result, err := aiService.ChatWithAI(context, query, token)
			Expect(err).To(HaveOccurred())
			Expect(result.GeneratedText).To(BeEmpty())
		})
	})
})
