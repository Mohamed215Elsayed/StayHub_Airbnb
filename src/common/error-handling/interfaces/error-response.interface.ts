export interface ErrorResponse {
    message: string | string[];
    field?: string;
    // statusCode: number;
    //   error?: string;      // زي "Bad Request", "Not Found"
    //   timestamp?: string;
    //   path?: string;        // الـ endpoint اللي حصل فيه الخطأ
}