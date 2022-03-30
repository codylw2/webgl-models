var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {

  // Vertex shader program
  const vsSource = `
    attribute vec3 aVertexPosition;
    attribute float v_Texture_coordinate;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying mediump vec2 vTextureCoord;
    uniform float max_t;
    uniform float min_t;
    uniform float dispScale;
    
    void main(void) {
      mediump vec3 scaled_positions = aVertexPosition * vec3(dispScale, dispScale, dispScale);
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(scaled_positions, 1);
      vTextureCoord = vec2((v_Texture_coordinate-min_t)/(max_t-min_t), 0.5);
    }
  `;

  // Fragment shader program
  const fsSource = `
    precision mediump int;
    precision mediump float;

    varying mediump vec2 vTextureCoord;
    uniform sampler2D uSampler;
    
    //-------------------------------------------------
    uniform vec2 u_rampSize;
    uniform float u_linearAdjust;
    //-------------------------------------------------
    void main() {
      vec2 texelRange = vTextureCoord * (u_rampSize - u_linearAdjust);
      vec2 rampUV = (texelRange + 0.5 * u_linearAdjust) / u_rampSize;
      gl_FragColor = texture2D(uSampler, rampUV);
    }
  `;

  const positions = [0.03, 0.0, 0.0, 0.025980762113533156, 0.015, 0.0, 0.015, 0.025980762113533156, 0.0, 0.0, 0.03, 0.0, -0.015, 0.025980762113533156, 0.0, -0.025980762113533156, 0.015, 0.0, -0.03, 0.0, 0.0, -0.025980762113533156, -0.015, 0.0, -0.015, -0.025980762113533156, 0.0, 0.0, -0.03, 0.0, 0.015, -0.025980762113533156, 0.0, 0.025980762113533156, -0.015, 0.0, 0.03, 0.0, 0.2, 0.025980762113533156, 0.015, 0.2, 0.015, 0.025980762113533156, 0.2, 0.0, 0.03, 0.2, -0.015, 0.025980762113533156, 0.2, -0.025980762113533156, 0.015, 0.2, -0.03, 0.0, 0.2, -0.025980762113533156, -0.015, 0.2, -0.015, -0.025980762113533156, 0.2, 0.0, -0.03, 0.2, 0.015, -0.025980762113533156, 0.2, 0.025980762113533156, -0.015, 0.2, 0.03, 0.0, 0.4, 0.025980762113533156, 0.015, 0.4, 0.015, 0.025980762113533156, 0.4, 0.0, 0.03, 0.4, -0.015, 0.025980762113533156, 0.4, -0.025980762113533156, 0.015, 0.4, -0.03, 0.0, 0.4, -0.025980762113533156, -0.015, 0.4, -0.015, -0.025980762113533156, 0.4, 0.0, -0.03, 0.4, 0.015, -0.025980762113533156, 0.4, 0.025980762113533156, -0.015, 0.4, 0.03, 0.0, 0.6, 0.025980762113533156, 0.015, 0.6, 0.015, 0.025980762113533156, 0.6, 0.0, 0.03, 0.6, -0.015, 0.025980762113533156, 0.6, -0.025980762113533156, 0.015, 0.6, -0.03, 0.0, 0.6, -0.025980762113533156, -0.015, 0.6, -0.015, -0.025980762113533156, 0.6, 0.0, -0.03, 0.6, 0.015, -0.025980762113533156, 0.6, 0.025980762113533156, -0.015, 0.6, 0.03, 0.0, 0.8, 0.025980762113533156, 0.015, 0.8, 0.015, 0.025980762113533156, 0.8, 0.0, 0.03, 0.8, -0.015, 0.025980762113533156, 0.8, -0.025980762113533156, 0.015, 0.8, -0.03, 0.0, 0.8, -0.025980762113533156, -0.015, 0.8, -0.015, -0.025980762113533156, 0.8, 0.0, -0.03, 0.8, 0.015, -0.025980762113533156, 0.8, 0.025980762113533156, -0.015, 0.8, 0.1, 0.0, 0.8, 0.08660254037844387, 0.05, 0.8, 0.05, 0.08660254037844387, 0.8, 0.0, 0.1, 0.8, -0.05, 0.08660254037844387, 0.8, -0.08660254037844387, 0.05, 0.8, -0.1, 0.0, 0.8, -0.08660254037844387, -0.05, 0.8, -0.05, -0.08660254037844387, 0.8, 0.0, -0.1, 0.8, 0.05, -0.08660254037844387, 0.8, 0.08660254037844387, -0.05, 0.8, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.03, 0.0, 0.015, 0.025980762113533156, 0.0, 0.025980762113533156, 0.015, 0.0, 0.03, 0.0, 0.0, 0.025980762113533156, -0.015, 0.0, 0.015, -0.025980762113533156, 0.0, 0.0, -0.03, 0.0, -0.015, -0.025980762113533156, 0.0, -0.025980762113533156, -0.015, 0.0, -0.03, 0.0, 0.0, -0.025980762113533156, 0.015, 0.0, -0.015, 0.025980762113533156, 0.2, 0.0, 0.03, 0.2, 0.015, 0.025980762113533156, 0.2, 0.025980762113533156, 0.015, 0.2, 0.03, 0.0, 0.2, 0.025980762113533156, -0.015, 0.2, 0.015, -0.025980762113533156, 0.2, 0.0, -0.03, 0.2, -0.015, -0.025980762113533156, 0.2, -0.025980762113533156, -0.015, 0.2, -0.03, 0.0, 0.2, -0.025980762113533156, 0.015, 0.2, -0.015, 0.025980762113533156, 0.4, 0.0, 0.03, 0.4, 0.015, 0.025980762113533156, 0.4, 0.025980762113533156, 0.015, 0.4, 0.03, 0.0, 0.4, 0.025980762113533156, -0.015, 0.4, 0.015, -0.025980762113533156, 0.4, 0.0, -0.03, 0.4, -0.015, -0.025980762113533156, 0.4, -0.025980762113533156, -0.015, 0.4, -0.03, 0.0, 0.4, -0.025980762113533156, 0.015, 0.4, -0.015, 0.025980762113533156, 0.6, 0.0, 0.03, 0.6, 0.015, 0.025980762113533156, 0.6, 0.025980762113533156, 0.015, 0.6, 0.03, 0.0, 0.6, 0.025980762113533156, -0.015, 0.6, 0.015, -0.025980762113533156, 0.6, 0.0, -0.03, 0.6, -0.015, -0.025980762113533156, 0.6, -0.025980762113533156, -0.015, 0.6, -0.03, 0.0, 0.6, -0.025980762113533156, 0.015, 0.6, -0.015, 0.025980762113533156, 0.8, 0.0, 0.03, 0.8, 0.015, 0.025980762113533156, 0.8, 0.025980762113533156, 0.015, 0.8, 0.03, 0.0, 0.8, 0.025980762113533156, -0.015, 0.8, 0.015, -0.025980762113533156, 0.8, 0.0, -0.03, 0.8, -0.015, -0.025980762113533156, 0.8, -0.025980762113533156, -0.015, 0.8, -0.03, 0.0, 0.8, -0.025980762113533156, 0.015, 0.8, -0.015, 0.025980762113533156, 0.8, 0.0, 0.1, 0.8, 0.05, 0.08660254037844387, 0.8, 0.08660254037844387, 0.05, 0.8, 0.1, 0.0, 0.8, 0.08660254037844387, -0.05, 0.8, 0.05, -0.08660254037844387, 0.8, 0.0, -0.1, 0.8, -0.05, -0.08660254037844387, 0.8, -0.08660254037844387, -0.05, 0.8, -0.1, 0.0, 0.8, -0.08660254037844387, 0.05, 0.8, -0.05, 0.08660254037844387, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.03, 0.0, 0.0, 0.025980762113533156, 0.0, 0.015, 0.015, 0.0, 0.025980762113533156, 0.0, 0.0, 0.03, -0.015, 0.0, 0.025980762113533156, -0.025980762113533156, 0.0, 0.015, -0.03, 0.0, 0.0, -0.025980762113533156, 0.0, -0.015, -0.015, 0.0, -0.025980762113533156, 0.0, 0.0, -0.03, 0.015, 0.0, -0.025980762113533156, 0.025980762113533156, 0.0, -0.015, 0.03, 0.2, 0.0, 0.025980762113533156, 0.2, 0.015, 0.015, 0.2, 0.025980762113533156, 0.0, 0.2, 0.03, -0.015, 0.2, 0.025980762113533156, -0.025980762113533156, 0.2, 0.015, -0.03, 0.2, 0.0, -0.025980762113533156, 0.2, -0.015, -0.015, 0.2, -0.025980762113533156, 0.0, 0.2, -0.03, 0.015, 0.2, -0.025980762113533156, 0.025980762113533156, 0.2, -0.015, 0.03, 0.4, 0.0, 0.025980762113533156, 0.4, 0.015, 0.015, 0.4, 0.025980762113533156, 0.0, 0.4, 0.03, -0.015, 0.4, 0.025980762113533156, -0.025980762113533156, 0.4, 0.015, -0.03, 0.4, 0.0, -0.025980762113533156, 0.4, -0.015, -0.015, 0.4, -0.025980762113533156, 0.0, 0.4, -0.03, 0.015, 0.4, -0.025980762113533156, 0.025980762113533156, 0.4, -0.015, 0.03, 0.6, 0.0, 0.025980762113533156, 0.6, 0.015, 0.015, 0.6, 0.025980762113533156, 0.0, 0.6, 0.03, -0.015, 0.6, 0.025980762113533156, -0.025980762113533156, 0.6, 0.015, -0.03, 0.6, 0.0, -0.025980762113533156, 0.6, -0.015, -0.015, 0.6, -0.025980762113533156, 0.0, 0.6, -0.03, 0.015, 0.6, -0.025980762113533156, 0.025980762113533156, 0.6, -0.015, 0.03, 0.8, 0.0, 0.025980762113533156, 0.8, 0.015, 0.015, 0.8, 0.025980762113533156, 0.0, 0.8, 0.03, -0.015, 0.8, 0.025980762113533156, -0.025980762113533156, 0.8, 0.015, -0.03, 0.8, 0.0, -0.025980762113533156, 0.8, -0.015, -0.015, 0.8, -0.025980762113533156, 0.0, 0.8, -0.03, 0.015, 0.8, -0.025980762113533156, 0.025980762113533156, 0.8, -0.015, 0.1, 0.8, 0.0, 0.08660254037844387, 0.8, 0.05, 0.05, 0.8, 0.08660254037844387, 0.0, 0.8, 0.1, -0.05, 0.8, 0.08660254037844387, -0.08660254037844387, 0.8, 0.05, -0.1, 0.8, 0.0, -0.08660254037844387, 0.8, -0.05, -0.05, 0.8, -0.08660254037844387, 0.0, 0.8, -0.1, 0.05, 0.8, -0.08660254037844387, 0.08660254037844387, 0.8, -0.05, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0];
  const indices = [0, 1, 12, 1, 13, 12, 1, 2, 13, 2, 14, 13, 2, 3, 14, 3, 15, 14, 3, 4, 15, 4, 16, 15, 4, 5, 16, 5, 17, 16, 5, 6, 17, 6, 18, 17, 6, 7, 18, 7, 19, 18, 7, 8, 19, 8, 20, 19, 8, 9, 20, 9, 21, 20, 9, 10, 21, 10, 22, 21, 10, 11, 22, 11, 23, 22, 11, 0, 23, 0, 12, 23, 12, 13, 24, 13, 25, 24, 13, 14, 25, 14, 26, 25, 14, 15, 26, 15, 27, 26, 15, 16, 27, 16, 28, 27, 16, 17, 28, 17, 29, 28, 17, 18, 29, 18, 30, 29, 18, 19, 30, 19, 31, 30, 19, 20, 31, 20, 32, 31, 20, 21, 32, 21, 33, 32, 21, 22, 33, 22, 34, 33, 22, 23, 34, 23, 35, 34, 23, 12, 35, 12, 24, 35, 24, 25, 36, 25, 37, 36, 25, 26, 37, 26, 38, 37, 26, 27, 38, 27, 39, 38, 27, 28, 39, 28, 40, 39, 28, 29, 40, 29, 41, 40, 29, 30, 41, 30, 42, 41, 30, 31, 42, 31, 43, 42, 31, 32, 43, 32, 44, 43, 32, 33, 44, 33, 45, 44, 33, 34, 45, 34, 46, 45, 34, 35, 46, 35, 47, 46, 35, 24, 47, 24, 36, 47, 36, 37, 48, 37, 49, 48, 37, 38, 49, 38, 50, 49, 38, 39, 50, 39, 51, 50, 39, 40, 51, 40, 52, 51, 40, 41, 52, 41, 53, 52, 41, 42, 53, 42, 54, 53, 42, 43, 54, 43, 55, 54, 43, 44, 55, 44, 56, 55, 44, 45, 56, 45, 57, 56, 45, 46, 57, 46, 58, 57, 46, 47, 58, 47, 59, 58, 47, 36, 59, 36, 48, 59, 48, 49, 60, 49, 61, 60, 49, 50, 61, 50, 62, 61, 50, 51, 62, 51, 63, 62, 51, 52, 63, 52, 64, 63, 52, 53, 64, 53, 65, 64, 53, 54, 65, 54, 66, 65, 54, 55, 66, 55, 67, 66, 55, 56, 67, 56, 68, 67, 56, 57, 68, 57, 69, 68, 57, 58, 69, 58, 70, 69, 58, 59, 70, 59, 71, 70, 59, 48, 71, 48, 60, 71, 60, 61, 72, 61, 62, 72, 62, 63, 72, 63, 64, 72, 64, 65, 72, 65, 66, 72, 66, 67, 72, 67, 68, 72, 68, 69, 72, 69, 70, 72, 70, 71, 72, 71, 60, 72, 0, 1, 73, 1, 2, 73, 2, 3, 73, 3, 4, 73, 4, 5, 73, 5, 6, 73, 6, 7, 73, 7, 8, 73, 8, 9, 73, 9, 10, 73, 10, 11, 73, 11, 0, 73, 74, 75, 86, 75, 87, 86, 75, 76, 87, 76, 88, 87, 76, 77, 88, 77, 89, 88, 77, 78, 89, 78, 90, 89, 78, 79, 90, 79, 91, 90, 79, 80, 91, 80, 92, 91, 80, 81, 92, 81, 93, 92, 81, 82, 93, 82, 94, 93, 82, 83, 94, 83, 95, 94, 83, 84, 95, 84, 96, 95, 84, 85, 96, 85, 97, 96, 85, 74, 97, 74, 86, 97, 86, 87, 98, 87, 99, 98, 87, 88, 99, 88, 100, 99, 88, 89, 100, 89, 101, 100, 89, 90, 101, 90, 102, 101, 90, 91, 102, 91, 103, 102, 91, 92, 103, 92, 104, 103, 92, 93, 104, 93, 105, 104, 93, 94, 105, 94, 106, 105, 94, 95, 106, 95, 107, 106, 95, 96, 107, 96, 108, 107, 96, 97, 108, 97, 109, 108, 97, 86, 109, 86, 98, 109, 98, 99, 110, 99, 111, 110, 99, 100, 111, 100, 112, 111, 100, 101, 112, 101, 113, 112, 101, 102, 113, 102, 114, 113, 102, 103, 114, 103, 115, 114, 103, 104, 115, 104, 116, 115, 104, 105, 116, 105, 117, 116, 105, 106, 117, 106, 118, 117, 106, 107, 118, 107, 119, 118, 107, 108, 119, 108, 120, 119, 108, 109, 120, 109, 121, 120, 109, 98, 121, 98, 110, 121, 110, 111, 122, 111, 123, 122, 111, 112, 123, 112, 124, 123, 112, 113, 124, 113, 125, 124, 113, 114, 125, 114, 126, 125, 114, 115, 126, 115, 127, 126, 115, 116, 127, 116, 128, 127, 116, 117, 128, 117, 129, 128, 117, 118, 129, 118, 130, 129, 118, 119, 130, 119, 131, 130, 119, 120, 131, 120, 132, 131, 120, 121, 132, 121, 133, 132, 121, 110, 133, 110, 122, 133, 122, 123, 134, 123, 135, 134, 123, 124, 135, 124, 136, 135, 124, 125, 136, 125, 137, 136, 125, 126, 137, 126, 138, 137, 126, 127, 138, 127, 139, 138, 127, 128, 139, 128, 140, 139, 128, 129, 140, 129, 141, 140, 129, 130, 141, 130, 142, 141, 130, 131, 142, 131, 143, 142, 131, 132, 143, 132, 144, 143, 132, 133, 144, 133, 145, 144, 133, 122, 145, 122, 134, 145, 134, 135, 146, 135, 136, 146, 136, 137, 146, 137, 138, 146, 138, 139, 146, 139, 140, 146, 140, 141, 146, 141, 142, 146, 142, 143, 146, 143, 144, 146, 144, 145, 146, 145, 134, 146, 74, 75, 147, 75, 76, 147, 76, 77, 147, 77, 78, 147, 78, 79, 147, 79, 80, 147, 80, 81, 147, 81, 82, 147, 82, 83, 147, 83, 84, 147, 84, 85, 147, 85, 74, 147, 148, 149, 160, 149, 161, 160, 149, 150, 161, 150, 162, 161, 150, 151, 162, 151, 163, 162, 151, 152, 163, 152, 164, 163, 152, 153, 164, 153, 165, 164, 153, 154, 165, 154, 166, 165, 154, 155, 166, 155, 167, 166, 155, 156, 167, 156, 168, 167, 156, 157, 168, 157, 169, 168, 157, 158, 169, 158, 170, 169, 158, 159, 170, 159, 171, 170, 159, 148, 171, 148, 160, 171, 160, 161, 172, 161, 173, 172, 161, 162, 173, 162, 174, 173, 162, 163, 174, 163, 175, 174, 163, 164, 175, 164, 176, 175, 164, 165, 176, 165, 177, 176, 165, 166, 177, 166, 178, 177, 166, 167, 178, 167, 179, 178, 167, 168, 179, 168, 180, 179, 168, 169, 180, 169, 181, 180, 169, 170, 181, 170, 182, 181, 170, 171, 182, 171, 183, 182, 171, 160, 183, 160, 172, 183, 172, 173, 184, 173, 185, 184, 173, 174, 185, 174, 186, 185, 174, 175, 186, 175, 187, 186, 175, 176, 187, 176, 188, 187, 176, 177, 188, 177, 189, 188, 177, 178, 189, 178, 190, 189, 178, 179, 190, 179, 191, 190, 179, 180, 191, 180, 192, 191, 180, 181, 192, 181, 193, 192, 181, 182, 193, 182, 194, 193, 182, 183, 194, 183, 195, 194, 183, 172, 195, 172, 184, 195, 184, 185, 196, 185, 197, 196, 185, 186, 197, 186, 198, 197, 186, 187, 198, 187, 199, 198, 187, 188, 199, 188, 200, 199, 188, 189, 200, 189, 201, 200, 189, 190, 201, 190, 202, 201, 190, 191, 202, 191, 203, 202, 191, 192, 203, 192, 204, 203, 192, 193, 204, 193, 205, 204, 193, 194, 205, 194, 206, 205, 194, 195, 206, 195, 207, 206, 195, 184, 207, 184, 196, 207, 196, 197, 208, 197, 209, 208, 197, 198, 209, 198, 210, 209, 198, 199, 210, 199, 211, 210, 199, 200, 211, 200, 212, 211, 200, 201, 212, 201, 213, 212, 201, 202, 213, 202, 214, 213, 202, 203, 214, 203, 215, 214, 203, 204, 215, 204, 216, 215, 204, 205, 216, 205, 217, 216, 205, 206, 217, 206, 218, 217, 206, 207, 218, 207, 219, 218, 207, 196, 219, 196, 208, 219, 208, 209, 220, 209, 210, 220, 210, 211, 220, 211, 212, 220, 212, 213, 220, 213, 214, 220, 214, 215, 220, 215, 216, 220, 216, 217, 220, 217, 218, 220, 218, 219, 220, 219, 208, 220, 148, 149, 221, 149, 150, 221, 150, 151, 221, 151, 152, 221, 152, 153, 221, 153, 154, 221, 154, 155, 221, 155, 156, 221, 156, 157, 221, 157, 158, 221, 158, 159, 221, 159, 148, 221];
  const textureCoordinates = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 0.0];
  // const rgb_colors = [
  //   255,192,203,
  //   255,0,255,
  //   128,0,128,
  //   0,0,128,
  //   0,0,255,
  //   0,255,255,
  //   0,128,128,
  //   0,128,0,
  //   // 128,128,0,
  //   0,255,0,
  //   255,255,0,
  //   255,215,0,
  //   255,165,0,
  //   // 210,180,140,
  //   165,42,42,
  //   128,0,0,
  //   255,0,0,
  // ];

  // const rgb_colors = [
  //   255,0,0,
  //   255,80,0,
  //   255,165,0,
  //   255,210,0,
  //   255,255,0,
  //   201,255,0,
  //   128,255,0,
  //   0,255,0,
  //   0,255,128,
  //   0,255,192,
  //   0,255,255,
  //   0,191,255,
  //   0,183,255,
  //   0,127,255,
  //   0,0,255,
  //   0,0,128,
  //   64,0,128,
  //   128,0,128
  // ]

  const rgb_colors = [
    128,0,128,
    64,0,128,
    0,0,128,
    0,0,255,
    0,127,255,
    0,183,255,
    0,191,255,
    0,255,255,
    0,255,192,
    0,255,128,
    0,255,0,
    128,255,0,
    201,255,0,
    255,255,0,
    255,210,0,
    255,165,0,
    255,80,0,
    255,0,0,
  ]
  // https://html-color.codes/purple

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }





  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);













  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return null;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return null;
  }

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }








  let vertexPositionAttrib = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  let textureCoordAttrib = gl.getAttribLocation(shaderProgram, 'v_Texture_coordinate');

  let projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  let modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
  let uSamplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
  let rampSizeLocation = gl.getUniformLocation(shaderProgram, "u_rampSize");
  let linearAdjustLocation = gl.getUniformLocation(shaderProgram, "u_linearAdjust");

  let maxLocation = gl.getUniformLocation(shaderProgram, "max_t");
  let minLocation = gl.getUniformLocation(shaderProgram, "min_t");
  let dispScaleLocation = gl.getUniformLocation(shaderProgram, "dispScale");



  const linearFilter = false;


  let tex_size;
  const texture = gl.createTexture();
  {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const width = rgb_colors.length / 3;
    gl.texImage2D(
        gl.TEXTURE_2D,     // target
        0,                 // mip level
        gl.RGB,            // internal format
        width,
        1,                 // height
        0,                 // border
        gl.RGB,            // format
        gl.UNSIGNED_BYTE,  // type
        new Uint8Array(rgb_colors));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linearFilter ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linearFilter ? gl.LINEAR : gl.NEAREST);
    tex_size = [width, 1];
  }










  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;





    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                cubeRotation,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                cubeRotation * .7,// amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(vertexPositionAttrib, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(vertexPositionAttrib);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 1;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.vertexAttribPointer(textureCoordAttrib, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(textureCoordAttrib);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Tell WebGL to use our program when drawing
    gl.useProgram(shaderProgram);

    // Set the shader uniforms
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);




    gl.uniform2fv(rampSizeLocation, tex_size);
    if (linearFilter) {
      gl.uniform1f(linearAdjustLocation, 1);
    }
    else {
      gl.uniform1f(linearAdjustLocation, 0);
    }


    gl.uniform1f(maxLocation, 1);
    gl.uniform1f(minLocation, 0);
    gl.uniform1f(dispScaleLocation, 2.5);
    // gl.uniform4f(dispScaleLocation, 10.0, 10.0, 10.0, 10.0);

    // Specify the texture to map onto the faces.
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(uSamplerUniform, 0);

    {
      const vertexCount = indices.length;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}




function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
