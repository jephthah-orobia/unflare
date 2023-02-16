import { Request, Response } from '@cloudflare/workers-types';
import Filter from './api/filter';

export default class Unflare {
  private filters: Filter[] = [];
}
