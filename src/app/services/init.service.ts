import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private endpoint = 'http://localhost:3000/init';

  constructor(private http: HttpClient) { }

  initUser(courseId: string, providerId: string, userDetails: any) {
    const payload = {
      context: {
        "domain": "onest:learning-experiences",
        "action": "init",
        "version": "1.1.0",
        "bap_id": "kahani-bap.tekdinext.com",
        "bap_uri": "https://kahani-bap.tekdinext.com/",
        "bpp_id": "kahani-bpp.tekdinext.com",
        "bpp_uri": "https://kahani-bpp.tekdinext.com/",
        transaction_id: this.generateUUID(),
        message_id: this.generateUUID(),
        timestamp: new Date().toISOString()
      },
      message: {
        order: {
          provider: { id: providerId },
          items: [{ id: courseId }],
          fulfillments: [
            {
              customer: {
                person: {
                  name: userDetails.name,
                  age: userDetails.age,
                  tags: [
                    {
                      code: "distributor-details",
                      list: [
                        {
                          descriptor: {
                            code: "distributor-name",
                            name: "Distributor Name"
                          },
                          value: ""
                        },
                        {
                          descriptor: {
                            code: "agent-id",
                            name: "Agent Id"
                          },
                          value: ""
                        }
                      ]
                    }
                  ]
                },
                contact: {
                  phone: userDetails.phone,
                  email: userDetails.email
                }
              }
            }
          ]
        }
      }
    };

    return this.http.post<any>(this.endpoint, payload);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
