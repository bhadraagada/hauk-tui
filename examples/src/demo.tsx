import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import { createDefaultTokens } from '@hauktui/tokens';
import { Button, Select } from '@hauktui/components';

const tokens = createDefaultTokens();

const Demo: React.FC = () => {
  const [clicked, setClicked] = useState(0);
  const [value, setValue] = useState<string>('apple');

  return (
    <Box flexDirection="column" gap={1}>
      <Text color={tokens.color.fg}>haukTUI demo</Text>
      <Button tokens={tokens} onPress={() => setClicked((c) => c + 1)}>Click Me</Button>
      <Text color={tokens.color.mutedFg}>Clicked: {clicked}</Text>
      <Box height={1}>
        <Text color={tokens.color.border}>──────────────</Text>
      </Box>
      <Select
        tokens={tokens}
        items={[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' }
        ]}
        onChange={(v) => setValue(String(v))}
      />
      <Text color={tokens.color.mutedFg}>Selected: {value}</Text>
    </Box>
  );
};

render(<Demo />);

