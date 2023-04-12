import axios from "axios";

export const pokeGraphQL = async (
  operationsDoc: string,
  operationName: string,
  variables?: Record<string, any>,
  orderBy?: Record<string, any>
) => {
  return axios({
    url: 'https://apipkm.codea.plus/v1/graphql',
    method: 'post',
    data: {
      query: operationsDoc,
      variables: { ...variables, ...orderBy },
      operationName,
    }
  }).then(result => {
    return result.data;
  });
}
