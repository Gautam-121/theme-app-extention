import React from 'react'
import {Layout, List} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from '@remix-run/react';

export async function loader({request}){
const { admin } = await authenticate.admin(request);

const response = await admin.graphql(
  `#graphql
  query {
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          updatedAt
          sortOrder
        }
      }
    }
  }`,
);

const data = await response.json();

return json(data)

}

const Collection = () => {
    const collection = useLoaderData()
    return (
      <Layout>
        <ui-title-bar title="Collections">
          <button onclick="console.log('Secondary action')">
            Secondary action
          </button>
          <button variant="primary" onclick="console.log('Primary action')">
            Primary action
          </button>
        </ui-title-bar>
        <List type="bullet">
          {collection.data.collections.edges.map((item, index) => (
            <>
              <List.Item key={index}>{item.node.title}</List.Item>
            </>
          ))}
        </List>
      </Layout>
    );
}

export default Collection