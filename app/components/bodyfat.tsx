import React, { useEffect, useState } from "react";
import { form } from "../information";
import { TextInput, View, Text } from "react-native";

const bodyfat = () => {
  // these are just for testing later they will be recieved from the user profile

  const gender = form.genderAtBirth; // m or f
  const height = parseFloat(form.height);
  const weight = parseFloat(form.weight);

  const [neck, setNeck] = useState<number | null>(null);
  const [belly, setBelly] = useState<number | null>(null);
  const [waist, setWaist] = useState<number | null>(null);
  const [hip, setHip] = useState<number | null>(null);
  const [bodyfat, setBodyfat] = useState<number | null>(null);

  useEffect(() => {
    if (gender === "m" && belly && neck) {
      const calculatedBodyFat =
        86.01 * Math.log10(belly - neck) - 70.041 * Math.log10(height) + 36.76;
      setBodyfat(calculatedBodyFat);
    } else {
      if (waist && neck && hip) {
        const calculatedBodyFat =
          163.205 * Math.log10(waist + hip - neck) -
          97.684 * Math.log10(height) -
          78.387;
        setBodyfat(calculatedBodyFat);
      }
    }
  }, [neck, belly, waist, hip]);

  return (
    <View>
      <TextInput
        placeholder="Neck Circumpherence (cm)"
        value={neck.toString()}
        onChangeText={(text) => setNeck(parseFloat(text))}
      />
      {gender === "m" ? (
        <>
          <TextInput
            placeholder="Belly Circumpherence (cm)"
            value={belly.toString()}
            onChangeText={(text) => setBelly(parseFloat(text))}
          />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Waist Circumpherence (cm)"
            value={waist.toString()}
            onChangeText={(text) => setWaist(parseFloat(text))}
          />
          <TextInput
            placeholder="Hip Circumpherence (cm)"
            value={hip.toString()}
            onChangeText={(text) => setHip(parseFloat(text))}
          />
        </>
      )}

      <Text>Body Fat: {bodyfat}%</Text>
    </View>
  );
};

export default bodyfat;
