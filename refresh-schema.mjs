import { getIntrospectionQuery } from 'graphql';
import fetch from 'node-fetch';
import * as fs from 'fs';

import { getIntrospectedSchema, minifyIntrospectionQuery } from '@urql/introspection';

fetch('https://api.league.ml/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: null,
    query: getIntrospectionQuery({ descriptions: false }),
    operationName: "IntrospectionQuery"
  }),
})
  .then(result => result.json())
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    fs.writeFileSync('./urql/schema.json', JSON.stringify(minified));
  });