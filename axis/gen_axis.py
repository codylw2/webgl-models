
import math

def length(vec):
    return sum([v**2 for v in vec])**0.5

def normalize(vec):
    lngth = length(vec)
    return [v/lngth for v in vec]

def distance(vec1, vec2):
    return [v-vec2[i] for i, v in enumerate(vec1)]

m = 1

p = math.pi
pts = [0.00, 0.20, 0.40, 0.60, 0.80, 0.80]
r   = [0.03, 0.03, 0.03, 0.03, 0.03, 0.10]

circle_x = [1, 3**0.5/2, 0.5, 0, -0.5, -3**0.5/2, -1, -3**0.5/2, -0.5, 0, 0.5, 3**0.5/2]
circle_y = [0, 0.5, 3**0.5/2, 1, 3**0.5/2, 0.5, 0, -0.5, -3**0.5/2, -1, -3**0.5/2, -0.5]
c_pts = len(circle_x)

pt_idx = 0
m_vertices = []
vertices = []
indices = []
texture = []
normals = []
for i in range(len(pts)):
    for j in range(c_pts):
        m_vertices.append(0)
        m_vertices.append(0)
        m_vertices.append(pts[i])

        vertices.append(circle_x[j]*r[i]*m)
        vertices.append(circle_y[j]*r[i]*m)
        vertices.append(pts[i]*m)

        # if i == 0 and j == 0:
        #     print(vertices[-3:], m_vertices[-3:])
        #     print(distance(vertices[-3:], m_vertices[-3:]))
        #     print(length(distance(vertices[-3:], m_vertices[-3:])))
        #     print(normalize(distance(vertices[-3:], m_vertices[-3:])))

        normals.extend(normalize(distance(vertices[-3:], m_vertices[-3:])))

        i1 = pt_idx
        i2 = pt_idx+1
        if i2 == (i+1)*c_pts: i2 = i*c_pts
        i3 = i1+c_pts
        i4 = i2+c_pts
        pt_idx += 1

        if i == len(pts)-1:
            indices.extend([i1, i2, (i+1)*c_pts])
        else:
            indices.extend([i1, i2, i3])
            indices.extend([i2, i4, i3])

        texture.append(pts[i])


vertices.extend([0.0, 0.0, 1.0*m])
m_vertices.extend([0.0, 0.0, 0.0])
normals.extend(normalize(distance(vertices[-3:], m_vertices[-3:])))
vertices.extend([0.0, 0.0, 0.0])
m_vertices.extend([0.0, 0.0, 1.0])
normals.extend(normalize(distance(vertices[-3:], m_vertices[-3:])))
texture.extend([1.0, 0.0])

# vertices.append(0.0)
# vertices.append(0.0)
# vertices.append(1.0*m)
# vertices.append(0.0)
# vertices.append(0.0)
# vertices.append(0.0)
#
# texture.append(1.0)
# texture.append(0.0)

# m_vertices.append(0)
# m_vertices.append(0)
# m_vertices.append(0)
# m_vertices.append(0)
# m_vertices.append(0)
# m_vertices.append(0)

# normals.extend(normalize([0,0,1]))
# normals.extend(normalize([0,0,-1]))


for j in range(c_pts):
    i1 = j
    i2 = j + 1
    if i2 == c_pts: i2 = 0
    indices.extend([i1, i2, int(len(vertices)/3)-1])


# # print(c_pts)
# # print(int(len(m_vertices)/3), m_vertices)
print('arrow:')
print(int(len(vertices)/3), vertices)
print(int(len(normals)/3), normals)
print(int(len(indices)/3), indices)
print(len(texture), texture)
# # print()
# # print(indices[12*3*2*0:12*3*2*1])
# # print(indices[12*3*2*1:12*3*2*2])
# # print(indices[12*3*2*2:12*3*2*3])


all_vertices = list()
all_m_vertices = list()
all_normals = list()
all_textures = list()
all_indices = list()

for i in range(3):
    for j in range(int(len(vertices)/3)):
        if i == 0:
            all_vertices.append(vertices[j*3])
            all_vertices.append(vertices[j*3+1])
            all_vertices.append(vertices[j*3+2])
        elif i == 1:
            all_vertices.append(vertices[j*3+2])
            all_vertices.append(vertices[j*3+1])
            all_vertices.append(vertices[j*3])
        else:
            all_vertices.append(vertices[j*3])
            all_vertices.append(vertices[j*3+2])
            all_vertices.append(vertices[j*3+1])
        if i == 0:
            all_m_vertices.append(m_vertices[j*3])
            all_m_vertices.append(m_vertices[j*3+1])
            all_m_vertices.append(m_vertices[j*3+2])
        elif i == 1:
            all_m_vertices.append(m_vertices[j*3+2])
            all_m_vertices.append(m_vertices[j*3+1])
            all_m_vertices.append(m_vertices[j*3])
        else:
            all_m_vertices.append(m_vertices[j*3])
            all_m_vertices.append(m_vertices[j*3+2])
            all_m_vertices.append(m_vertices[j*3+1])
        all_normals.extend(normalize(distance(all_vertices[-3:], all_m_vertices[-3:])))

    for j in range(len(texture)):
        all_textures.append(texture[j])
    for j in range(int(len(indices)/3)):
        all_indices.append(indices[j*3]+int(len(vertices)/3)*i)
        all_indices.append(indices[j*3+1]+int(len(vertices)/3)*i)
        all_indices.append(indices[j*3+2]+int(len(vertices)/3)*i)

print()
print('axis:')
print(int(len(all_vertices)/3), all_vertices)
print(int(len(all_normals)/3), all_normals)
print(int(len(all_indices)/3), all_indices)
print(len(all_textures), all_textures)
