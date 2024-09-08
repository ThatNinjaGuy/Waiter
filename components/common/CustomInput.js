const ControlledInput = React.memo(
  ({ initialValue, onChangeText, ...props }) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = useCallback(
      (newValue) => {
        setValue(newValue);
        onChangeText(newValue);
      },
      [onChangeText]
    );

    return <TextInput value={value} onChangeText={handleChange} {...props} />;
  }
);
