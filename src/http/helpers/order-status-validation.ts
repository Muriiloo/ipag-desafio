//sequencia de status permitidos
const STATUS_SEQUENCE = [
  "pending",
  "waiting_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
];

export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
) {
  //nao permitir transições para o mesmo status
  if (currentStatus === newStatus) {
    return false;
  }

  //permitir cancelamento apenas se não estiver entregue ou cancelado
  if (newStatus === "canceled") {
    return currentStatus !== "delivered" && currentStatus !== "canceled";
  }

  //verificar se os status existem na sequência
  const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus);
  const newIndex = STATUS_SEQUENCE.indexOf(newStatus);

  if (currentIndex === -1 || newIndex === -1) {
    return false;
  }

  //permitir apenas avanço sequencial (exceto cancelamento)
  return newIndex === currentIndex + 1;
}
