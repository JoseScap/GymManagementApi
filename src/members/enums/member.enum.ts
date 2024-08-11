export enum MemberStatus {
  Inactivo = 'Inactivo',
  Día = 'Día',
  Semana = 'Semana',
  Mes = 'Mes',
}

export enum ActiveMemberStatus {
  Día = MemberStatus.Día,
  Semana = MemberStatus.Semana,
  Mes = MemberStatus.Mes,
}