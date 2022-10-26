import { CreateSeriesPolicyHandler } from 'src/series/policies/create-series-policy.handler';
import { CheckPolicies } from './check-policies';

describe('CheckPolicies', () => {
  it('should be defined', () => {
    // Check how to verifyclear
    CheckPolicies(new CreateSeriesPolicyHandler());
  });
});
