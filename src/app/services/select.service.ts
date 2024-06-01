import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  private endpoint = 'http://localhost:3000/select';

  constructor(private http: HttpClient) { }

  selectCourse(courseId: string, providerId: string) {
    const body = {
      context: {
        "domain": "onest:learning-experiences",
        "action": "select",
        "version": "1.1.0",
        "bap_id": "kahani-bap.tekdinext.com",
        "bap_uri": "https://kahani-bap.tekdinext.com/",
        "bpp_id": "sandbox.onest.network/adaptor-bpp/smartlab",
        "bpp_uri": "https://sandbox.onest.network/adaptor-bpp/smartlab/bpp",
        transaction_id: this.generateUUID(),
        message_id: this.generateUUID(),
        timestamp: new Date().toISOString()
      },
      message: {
        order: {
          provider: { id: providerId },
          items: [{ id: courseId }]
        }
      }
    };
    return this.http.post<any>(this.endpoint, body);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
