export const StatDisplay = ({
	title,
	stat,
}: { title: string; stat: string }) => (
	<div class="card">
		<h2>{title}</h2>
		<div>{stat}</div>
	</div>
);
