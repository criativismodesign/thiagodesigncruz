interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <h2 
        className="font-semibold uppercase"
        style={{ 
          fontSize: '36px',
          color: '#292929',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}
      >
        {title}
      </h2>
      <p 
        className="font-normal uppercase"
        style={{ 
          fontSize: '18px',
          color: '#292929',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          textTransform: 'uppercase'
        }}
      >
        {subtitle}
      </p>
      <div 
        className="mx-auto mt-4"
        style={{ 
          width: '80px',
          height: '2px',
          backgroundColor: '#DAA520'
        }}
      />
    </div>
  );
}
