import { gateway } from "../../declarations/gateway";
import { createActor } from "../../declarations/portal";
import { AuthClient, handleAuthenticated } from "@dfinity/auth-client";

document.querySelector("form").addEventListener("submit", async (e) => {

  e.preventDefault();
  const button = e.target.querySelector("button");

  const name = document.getElementById("name").value.toString();

  button.setAttribute("disabled", true);

  let a = await gateway.createPortal();
  console.log(a);
  const g = createActor(a['ok'])
  console.log(await g.getFollowers())
  // Interact with foo actor, calling the greet method
  //const greeting = await blotch_frontend.greet(name);
  const greeting = "Test";

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greeting;

  return false;
});
