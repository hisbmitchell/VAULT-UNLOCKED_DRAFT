const CustomShader = {

	uniforms: {

		"mainTexture":   { type: "t", value: null},
		"time":       { type: "f", value: 0.0 },
		"coolValue": { type: "f", value: 0.5 },

	},





	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	// fragmentShader: [
	//
	// 	"uniform float time;",
	// 	"uniform float coolValue;",
	// 	"uniform sampler2D mainTexture;",
	// 	"varying vec2 vUv;",
	//
	// 	"void main() {",
	//
	// 		// sample the source
	// 		"vec4 cTextureScreen = texture2D( mainTexture, vUv );",
	//
  //     "cTextureScreen.rgb = sin(cTextureScreen.rgb * vec3(0.33, 0.66, 1.) + length(cTextureScreen) + coolValue) * 0.5 + 0.5;",
	//
	// 		"gl_FragColor =  vec4( 1. - cTextureScreen.rgb, cTextureScreen.a );",
	//
	// 	"}"

	fragmentShader: [

	'uniform float time;',
	"uniform float coolValue;",
	"uniform sampler2D mainTexture;",
	'varying vec2 vUv;',

 'float random (in vec2 st) {',
      'return fract (sin(dot(st.xy,',
                            'vec2(12.9898, 78.233)))*',
                    '43758.543123);',
'    }',

  'float noise (in vec2 st) {',
      'vec2 i = floor(st);',
      'vec2 f = fract(st);',
     //four corner in 2D of the tile
      'float a = random(i);',
      'float b = random(i + vec2(1.0, 0.0));',
      'float c = random(i + vec2(0.0, 1.0));',
      'float d = random(i + vec2(1.0, 1.0));',

      'vec2 u = f * f * (3.0 - 2.0 * f);',

      'return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) +',
          '(d - b) * u.x * u.y;',
      '  }',
   'float fbm (in vec2 p) {',
      'const int octaves = 1;',
      'float freqScale = 2.;',
    '  float ampScale = 0.666;',
    '  float frequency = 1.;',
    '  float amplitude = 1.;',
    '  float result;', //keep track of the sum of the noise outside
      //of the loop
      'for (int i = 0;i < octaves; i++) {',
          'result += noise(p*frequency)*amplitude;',
          'frequency *= freqScale;',
          'amplitude *= ampScale;',
    '  }',
          'return result;',
'  }',

'void main()',
'{',
	// sample the source
		"vec4 cTextureScreen = texture2D( mainTexture, vUv );",
		"vec2 position = mod(vUv, vec2(1.));",

    // Normalized pixel coordinates (from 0 to 1)



    'position.x += sin(time*0.015 +  position.y*11.) * cos(time*0.08) * 0.005 ;',
    'position.y += cos(time*0.02 +  position.x*11.) * sin(0.04) * 0.005;',

		// 'position.y += cos(time*0.02 +  position.x*11.) * sin(0.04) * 50000.;',

		//'position.y += cos(time*0.02 +  position.x*11.) * sin(0.04) * 50000.;',

	//	'position.x += sin(time*0.015 +  position.y*11.) * cos(time*0.08) * 0.05 ;',

    // Time varying pixel color

    'vec3 col = texture2D( mainTexture, position ).rgb;',



    'float fbmResult = fbm(vec2(length(col)*0.05, time * 0.0001))*6.;',

    'position += vec2(sin(.006*fbmResult), cos(8.*fbmResult))*cos(time *.003);',
    'col = texture2D( mainTexture, position ).rgb;',
    'col = sin(col + length(col)*1.5 + 100. * 0.001) * -0.49 + 0.6;',

		//'float red = abs(sin(position.x * position.y + time / 5.0));',

    // Output to screen
  '  gl_FragColor = vec4(col, 1.0);',
'}',



	].join("\n")

};

export default CustomShader ;
