export default function success(res, data) {
  res.status(200).send(data ? data : "ok");
}
