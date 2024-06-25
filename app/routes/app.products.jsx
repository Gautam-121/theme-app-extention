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
        products(first: 10, reverse: true) {
          edges {
            node {
              id
              title
              handle
              resourcePublicationOnCurrentPublication {
                publication {
                  name
                  id
                }
                publishDate
                isPublished
              }
            }
          }
        }
      }`,
    );
    
    const data = await response.json();
    

return json(data)

}

const Products = () => {
    const collection = useLoaderData()
    console.log(collection)
    return (
      <Layout>
        <ui-title-bar title="Products">
          <button onclick="console.log('Secondary action')">
            Secondary action
          </button>
          <button variant="primary" onclick="console.log('Primary action')">
            Primary action
          </button>
        </ui-title-bar>
        <List type="bullet">
          {collection.data.products.edges.map((item, index) => (
            <>
              <List.Item key={index}>{item.node.title}</List.Item>
            </>
          ))}
        </List>
      </Layout>
    );
}

export default Products