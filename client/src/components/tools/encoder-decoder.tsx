import { FC, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";
import {
  encodeBase64,
  decodeBase64,
  encodeURL,
  decodeURL,
  encodeHTML,
  decodeHTML,
  toHex,
  fromHex,
} from "@/lib/utils";

interface EncoderDecoderProps {}

const EncoderDecoder: FC<EncoderDecoderProps> = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [encodingType, setEncodingType] = useState("url");
  const [operation, setOperation] = useState<"encode" | "decode">("encode");

  const handleProcess = () => {
    if (!inputText) return;

    try {
      if (operation === "encode") {
        switch (encodingType) {
          case "url":
            setOutputText(encodeURL(inputText));
            break;
          case "base64":
            setOutputText(encodeBase64(inputText));
            break;
          case "html":
            setOutputText(encodeHTML(inputText));
            break;
          case "hex":
            setOutputText(toHex(inputText));
            break;
          default:
            setOutputText("");
        }
      } else {
        switch (encodingType) {
          case "url":
            setOutputText(decodeURL(inputText));
            break;
          case "base64":
            setOutputText(decodeBase64(inputText));
            break;
          case "html":
            setOutputText(decodeHTML(inputText));
            break;
          case "hex":
            setOutputText(fromHex(inputText));
            break;
          default:
            setOutputText("");
        }
      }
    } catch (error) {
      console.error("Error processing text:", error);
      setOutputText(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Encoder/Decoder Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="encode"
            value={operation}
            onValueChange={(v) => setOperation(v as "encode" | "decode")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Input Text
                  </label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Text to ${operation}...`}
                    className="bg-dark-400 border-dark-300 text-gray-200 h-32"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Encoding Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant={encodingType === "url" ? "default" : "outline"}
                      onClick={() => setEncodingType("url")}
                      size="sm"
                    >
                      URL
                    </Button>
                    <Button
                      variant={encodingType === "base64" ? "default" : "outline"}
                      onClick={() => setEncodingType("base64")}
                      size="sm"
                    >
                      Base64
                    </Button>
                    <Button
                      variant={encodingType === "html" ? "default" : "outline"}
                      onClick={() => setEncodingType("html")}
                      size="sm"
                    >
                      HTML
                    </Button>
                    <Button
                      variant={encodingType === "hex" ? "default" : "outline"}
                      onClick={() => setEncodingType("hex")}
                      size="sm"
                    >
                      Hex
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleProcess} 
                  className="w-full"
                >
                  {operation === "encode" ? "Encode" : "Decode"}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Output
                </label>
                <div className="relative">
                  <Textarea
                    value={outputText}
                    readOnly
                    className="bg-dark-400 border-dark-300 text-gray-200 h-32"
                  />
                  {outputText && (
                    <div className="absolute top-2 right-2">
                      <CopyButton value={outputText} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncoderDecoder;
