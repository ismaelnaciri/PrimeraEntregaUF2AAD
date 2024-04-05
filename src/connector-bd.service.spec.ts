import { TestBed } from '@angular/core/testing';

import { ConnectorBDService } from './connector-bd.service';

describe('ConnectorBDService', () => {
  let service: ConnectorBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
