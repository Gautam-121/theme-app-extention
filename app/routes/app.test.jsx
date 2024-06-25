import { json } from "@remix-run/node"; // or cloudflare/deno
import { Form, useLoaderData } from "@remix-run/react";
import { Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// Run on server side
export async function loader({request}) {
  // provides data to the component
  const { admin } = await authenticate.admin(request);

  /*
    Fetch product as component load 
  const response = await admin.graphql(
    `#graphql
  query {
    product(id: "gid://shopify/Product/10933235974462") {
      title
      description
      onlineStoreUrl
    }
  }`,
  );
  const data = await response.json();
 */

  /*
  Update the product as Component Load
  const response = await admin.graphql(
  `#graphql
  mutation {
    productUpdate(input: {id: "gid://shopify/Product/108828309", title: "Sweet new product - GraphQL Edition"}) {
      product {
        id
      }
    }
  }`,
);

const data = await response.json();
   */

    return json({
      displayName: "Gautam",
      email: "gautamdhakate1234@gmail.com"
    })
}


// Run on server side
export async function action({request}) {
    const formData = await request.formData();
    console.log("formData" , formData.get("displayName"))
    console.log("formData" , formData.get("email"))
    return json({ 
        name:formData.get("displayName"),
        email: formData.get("email")
    });
  }

// Run on client side
export default function Test() {
    const user = useLoaderData()
    return (
      <Layout>
        {/*Using app-bridge component */}
        <ui-title-bar title="Prod"> 
          <button onclick="console.log('Secondary action')">
            Secondary action
          </button>
          <button variant="primary" onclick="console.log('Primary action')">
            Primary action
          </button>
        </ui-title-bar>

        {/* Inside the admin - app surface using shopify polariser */}
        <Form method="post">
          <h1>Settings for {user.displayName}</h1>

          <input name="displayName" defaultValue={user.displayName} />
          <input name="email" defaultValue={user.email} />

          <button type="submit">Save</button>
        </Form>
      </Layout>
    );
  }