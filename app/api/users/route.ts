export async function GET() {
  const users =[
    {id: 1, username: "Aastha", email: "a@example.com" },
    {id:2, username: "Ram",  email: "r@example.com"},
    {id:3, username:"Sita", email:"s@example.com"},
  ];
  return Response.json(users);
}