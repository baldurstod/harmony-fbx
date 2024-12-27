export enum TimeMode {
	Default = 0,
	Frames120 = 1,
	Frames100 = 2,
	Frames60 = 3,
	Frames50 = 4,
	Frames48 = 5,
	Frames30 = 6,
	Frames30Drop = 7,
	NtscDropFrame = 8,
	NtscFullFrame = 9,
	Pal = 10,
	Frames24 = 11,
	Frames1000 = 12,
	FilmFullFrame = 13,
	Custom = 14,
	Frames96 = 15,
	Frames72 = 16,
	Frames59_94 = 17,
	Frames119_88 = 18,
}

// TODO: remove those
export const FBX_TIME_MODE_DEFAULT = 0;
export const FBX_TIME_MODE_FRAMES_120 = 1;
export const FBX_TIME_MODE_FRAMES_100 = 2;
export const FBX_TIME_MODE_FRAMES_60 = 3;
export const FBX_TIME_MODE_FRAMES_50 = 4;
export const FBX_TIME_MODE_FRAMES_48 = 5;
export const FBX_TIME_MODE_FRAMES_30 = 6;
export const FBX_TIME_MODE_FRAMES_30_DROP = 7;
export const FBX_TIME_MODE_NTSC_DROP_FRAME = 8;
export const FBX_TIME_MODE_NTSC_FULL_FRAME = 9;
export const FBX_TIME_MODE_PAL = 10;
export const FBX_TIME_MODE_FRAMES_24 = 11;
export const FBX_TIME_MODE_FRAMES_1000 = 12;
export const FBX_TIME_MODE_FILM_FULL_FRAME = 13;
export const FBX_TIME_MODE_CUSTOM = 14;
export const FBX_TIME_MODE_FRAMES_96 = 15;
export const FBX_TIME_MODE_FRAMES_72 = 16;
export const FBX_TIME_MODE_FRAMES_59_94 = 17;
export const FBX_TIME_MODE_FRAMES_119_88 = 18;

export const FBX_TIME_MODE_FRAMES = [
	30,
	120,
	100,
	60,
	50,
	48,
	30,
	30,
	29.97,
	29.97,
	25,
	24,
	1000,
	23.976,
	-1,
	96,
	72,
	59.94,
	119.88,
];
