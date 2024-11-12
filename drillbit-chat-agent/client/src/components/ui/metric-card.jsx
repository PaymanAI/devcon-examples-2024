import { Card, CardHeader, CardTitle, CardContent } from "./card";

const MetricCard = ({ className, title, value, icon }) => (
  <Card className={`${className} p-6 text-white text-center rounded-md`}>
    <CardHeader className="flex flex-col items-center justify-between space-y-0 pb-2">
      {icon}
      <CardTitle className="text-sm font-medium pt-2">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0 pb-3">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export { MetricCard };
